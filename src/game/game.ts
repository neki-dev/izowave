import Phaser from 'phaser';

import {
  AUDIO_VOLUME, CONTAINER_ID, DEBUG_MODS, SETTINGS,
} from '~const/game';
import { Analytics } from '~lib/analytics';
import { Tutorial } from '~lib/tutorial';
import { eachEntries, registerScript } from '~lib/utils';
import { Gameover } from '~scene/gameover';
import { Menu } from '~scene/menu';
import { Screen } from '~scene/screen';
import { System } from '~scene/system';
import { World } from '~scene/world';
import { IAnalytics } from '~type/analytics';
import {
  GameAdType,
  GameDifficulty,
  GameEvents,
  GameFlag,
  GameScene,
  GameSettings,
  GameStat,
  IGame,
} from '~type/game';
import { MenuPage } from '~type/menu';
import { IScreen } from '~type/screen';
import { ITutorial } from '~type/tutorial';
import { IWorld } from '~type/world';

import { shaders } from '../shaders';

export class Game extends Phaser.Game implements IGame {
  readonly tutorial: ITutorial;

  readonly analytics: IAnalytics;

  private flags: string[];

  private _isStarted: boolean = false;

  public get isStarted() { return this._isStarted; }

  private set isStarted(v) { this._isStarted = v; }

  private _onPause: boolean = false;

  public get onPause() { return this._onPause; }

  private set onPause(v) { this._onPause = v; }

  private _isFinished: boolean = false;

  public get isFinished() { return this._isFinished; }

  private set isFinished(v) { this._isFinished = v; }

  private _screen: IScreen;

  public get screen() { return this._screen; }

  private set screen(v) { this._screen = v; }

  private _world: IWorld;

  public get world() { return this._world; }

  private set world(v) { this._world = v; }

  private _settings: Partial<Record<GameSettings, string>> = {};

  public get settings() { return this._settings; }

  private set settings(v) { this._settings = v; }

  public difficulty: GameDifficulty = GameDifficulty.NORMAL;

  constructor() {
    super({
      scene: [System, World, Screen, Menu, Gameover],
      pixelArt: true,
      autoRound: true,
      disableContextMenu: true,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: CONTAINER_ID,
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: DEBUG_MODS.basic,
          fps: 60,
          gravity: { y: 0 },
        },
      },
    });

    this.tutorial = new Tutorial();
    this.analytics = new Analytics();

    this.readFlags();
    this.readSettings();

    if (this.isFlagEnabled(GameFlag.ADS)) {
      registerScript('https://sdk.crazygames.com/crazygames-sdk-v2.js');
    }

    this.events.on(Phaser.Core.Events.READY, () => {
      this.screen = <IScreen> this.scene.getScene(GameScene.SCREEN);
      this.world = <IWorld> this.scene.getScene(GameScene.WORLD);

      this.sound.setVolume(AUDIO_VOLUME);

      this.registerShaders();
    });

    this.events.on(`${GameEvents.UPDATE_SETTINGS}.${GameSettings.AUDIO}`, (value: string) => {
      this.sound.mute = (value === 'off');
    });

    this.events.on(`${GameEvents.UPDATE_SETTINGS}.${GameSettings.TUTORIAL}`, (value: string) => {
      if (value === 'on') {
        this.tutorial.enable();
      } else {
        this.tutorial.disable();
      }
    });

    window.onerror = (message, path, line, column, error) => {
      if (error) {
        this.analytics.trackError(error);
      } else if (typeof message === 'string') {
        this.analytics.trackError(new Error(message));
      }

      return false;
    };
  }

  public pauseGame() {
    this.onPause = true;

    this.world.scene.pause();
    this.screen.scene.pause();

    this.scene.systemScene.scene.launch(GameScene.MENU, {
      page: MenuPage.ABOUT,
    });
  }

  public resumeGame() {
    this.onPause = false;

    this.scene.systemScene.scene.stop(GameScene.MENU);

    this.world.scene.resume();
    this.screen.scene.resume();
  }

  public startNewGame() {
    if (this.isStarted) {
      return;
    }

    if (!this.isSettingEnabled(GameSettings.TUTORIAL)) {
      this.tutorial.disable();
    }

    this.scene.systemScene.scene.stop(GameScene.MENU);
    this.scene.systemScene.scene.launch(GameScene.SCREEN);

    this.world.start();

    this.isStarted = true;

    if (!IS_DEV_MODE) {
      window.onbeforeunload = function confirmLeave() {
        return 'Leave game? No saves!';
      };
    }
  }

  public stopGame() {
    if (!this.isStarted) {
      return;
    }

    this.isStarted = false;

    this.world.stop();
    this.world.scene.restart();

    this.tutorial.reset();

    if (this.isFinished) {
      this.isFinished = false;
      this.scene.systemScene.scene.stop(GameScene.GAMEOVER);
    }

    this.scene.systemScene.scene.stop(GameScene.SCREEN);
    this.scene.systemScene.scene.launch(GameScene.MENU, {
      page: MenuPage.NEW_GAME,
    });

    this.showAd(GameAdType.MIDGAME);

    if (!IS_DEV_MODE) {
      window.onbeforeunload = null;
    }
  }

  public finishGame() {
    if (!this.isStarted) {
      return;
    }

    this.isFinished = true;

    this.events.emit(GameEvents.FINISH);

    const record = this.getRecordStat();
    const stat = this.getCurrentStat();

    if (!IS_DEV_MODE) {
      this.writeBestStat(stat, record);
    }

    this.scene.systemScene.scene.stop(GameScene.SCREEN);
    this.scene.systemScene.scene.launch(GameScene.GAMEOVER, { stat, record });

    this.analytics.trackEvent({
      world: this.world,
      success: false,
    });
  }

  public getDifficultyMultiplier() {
    switch (this.difficulty) {
      case GameDifficulty.EASY: return 0.8;
      case GameDifficulty.HARD: return 1.3;
      default: return 1.0;
    }
  }

  public updateSetting(key: GameSettings, value: string) {
    this.settings[key] = value;
    localStorage.setItem(`SETTINGS.${key}`, value);

    this.events.emit(`${GameEvents.UPDATE_SETTINGS}.${key}`, value);
  }

  public isSettingEnabled(key: GameSettings) {
    return (this.settings[key] === 'on');
  }

  private readSettings() {
    eachEntries(GameSettings, (key) => {
      this.settings[key] = localStorage.getItem(`SETTINGS.${key}`) ?? SETTINGS[key].default;
    });
  }

  public isFlagEnabled(key: GameFlag) {
    return this.flags.includes(key);
  }

  private readFlags() {
    const query = new URLSearchParams(window.location.search);
    const rawFlags = query.get('flags');

    this.flags = rawFlags?.toUpperCase().split(',') ?? [];
  }

  public showAd(type: GameAdType, callback?: () => void) {
    if (!this.isFlagEnabled(GameFlag.ADS)) {
      return;
    }

    // @ts-ignore
    window.CrazyGames?.SDK?.ad?.requestAd(type, {
      adStarted: () => {
        this.pause();
      },
      adFinished: () => {
        this.resume();
        callback?.();
      },
      adError: (error: any) => {
        console.warn(`Error ${type} ad:`, error);
      },
    });
  }

  private getRecordStat(): Nullable<GameStat> {
    try {
      const recordValue = localStorage.getItem(`BEST_STAT.${this.difficulty}`);

      return recordValue && JSON.parse(recordValue);
    } catch (error) {
      return null;
    }
  }

  private writeBestStat(stat: GameStat, record: Nullable<GameStat>) {
    const params = Object.keys(stat) as (keyof GameStat)[];
    const betterStat = params.reduce((curr, param) => ({
      ...curr,
      [param]: Math.max(stat[param], record?.[param] ?? 0),
    }), {});

    localStorage.setItem(`BEST_STAT.${this.difficulty}`, JSON.stringify(betterStat));
  }

  private getCurrentStat(): GameStat {
    return {
      score: this.world.player.score,
      waves: this.world.wave.number - 1,
      kills: this.world.player.kills,
      lived: this.world.getTime() / 1000 / 60,
    };
  }

  private registerShaders() {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

    eachEntries(shaders, (name, Shader) => {
      renderer.pipelines.addPostPipeline(name, Shader);
    });
  }
}
