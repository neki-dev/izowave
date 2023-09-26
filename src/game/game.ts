import Phaser from 'phaser';

import {
  AUDIO_VOLUME, CONTAINER_ID, DEBUG_MODS, SETTINGS,
} from '~const/game';
import { Analytics } from '~lib/analytics';
import { SDK } from '~lib/sdk';
import { Storage } from '~lib/storage';
import { Tutorial } from '~lib/tutorial';
import { eachEntries } from '~lib/utils';
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
  GameSavePayload,
  GameScene,
  GameSettings,
  GameStat,
  GameState,
  IGame,
} from '~type/game';
import { MenuPage } from '~type/menu';
import { IScreen } from '~type/screen';
import { ISDK, SDKPlatform } from '~type/sdk';
import { IStorage, StorageSave } from '~type/storage';
import { ITutorial } from '~type/tutorial';
import { IWorld } from '~type/world';

import { shaders } from '../shaders';

export class Game extends Phaser.Game implements IGame {
  readonly tutorial: ITutorial;

  readonly analytics: IAnalytics;

  readonly storage: IStorage;

  private sdk: ISDK | null = null;

  private flags: string[];

  public difficulty: GameDifficulty = GameDifficulty.NORMAL;

  private _state: GameState = GameState.IDLE;

  public get state() { return this._state; }

  private set state(v) { this._state = v; }

  private _screen: IScreen;

  public get screen() { return this._screen; }

  private set screen(v) { this._screen = v; }

  private _world: IWorld;

  public get world() { return this._world; }

  private set world(v) { this._world = v; }

  private _settings: Partial<Record<GameSettings, string>> = {};

  public get settings() { return this._settings; }

  private set settings(v) { this._settings = v; }

  private _usedSave: Nullable<StorageSave> = null;

  public get usedSave() { return this._usedSave; }

  private set usedSave(v) { this._usedSave = v; }

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
    this.storage = new Storage();

    this.readFlags();
    this.readSettings();

    this.createSDK();

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

  public async loadPayload() {
    return this.storage.init()
      .then(() => this.storage.load());
  }

  public pauseGame() {
    if (this.state !== GameState.STARTED) {
      return;
    }

    this.state = GameState.PAUSED;

    this.world.scene.pause();
    this.screen.scene.pause();

    this.scene.systemScene.scene.launch(GameScene.MENU, {
      defaultPage: null,
    });
  }

  public resumeGame() {
    if (this.state !== GameState.PAUSED) {
      return;
    }

    this.state = GameState.STARTED;

    this.scene.systemScene.scene.stop(GameScene.MENU);

    this.world.scene.resume();
    this.screen.scene.resume();
  }

  public continueGame(save: StorageSave) {
    if (this.state !== GameState.IDLE) {
      return;
    }

    this.usedSave = save;

    this.loadSavePayload(this.usedSave.payload.game);

    this.world.scene.restart(this.usedSave.payload.level);

    this.world.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.startGame();
    });
  }

  public startNewGame() {
    if (this.state !== GameState.IDLE) {
      return;
    }

    this.usedSave = null;

    this.startGame();
  }

  private startGame() {
    if (this.state !== GameState.IDLE) {
      return;
    }

    this.state = GameState.STARTED;

    if (!this.isSettingEnabled(GameSettings.TUTORIAL)) {
      this.tutorial.disable();
    }

    this.scene.systemScene.scene.stop(GameScene.MENU);
    this.scene.systemScene.scene.launch(GameScene.SCREEN);

    this.world.start();

    if (!IS_DEV_MODE) {
      window.onbeforeunload = function confirmLeave() {
        return 'Do you confirm leave game?';
      };
    }
  }

  public stopGame() {
    if (this.state === GameState.IDLE) {
      return;
    }

    if (this.state === GameState.FINISHED) {
      this.scene.systemScene.scene.stop(GameScene.GAMEOVER);
    }

    this.state = GameState.IDLE;

    this.world.scene.restart();

    this.tutorial.reset();

    this.scene.systemScene.scene.stop(GameScene.SCREEN);
    this.scene.systemScene.scene.launch(GameScene.MENU, {
      defaultPage: MenuPage.NEW_GAME,
    });

    this.showAdv(GameAdType.MIDGAME);

    if (!IS_DEV_MODE) {
      window.onbeforeunload = null;
    }
  }

  public finishGame() {
    if (this.state !== GameState.STARTED) {
      return;
    }

    this.state = GameState.FINISHED;

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
      case GameDifficulty.HARD: return 1.4;
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
    const value = query.get('flags')?.toUpperCase() ?? '';

    this.flags = value.split(',');
  }

  public showAdv(type: GameAdType, callback?: () => void) {
    if (!this.sdk || !this.isFlagEnabled(GameFlag.ADS)) {
      return;
    }

    this.sdk.showAdv(
      type,
      () => {
        this.pause();
      },
      () => {
        this.resume();
        callback?.();
      },
    );
  }

  private createSDK() {
    const query = new URLSearchParams(window.location.search);
    const platform = <SDKPlatform> query.get('sdk')?.toUpperCase();

    if (platform) {
      this.sdk = new SDK(platform);
    }
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

  public getSavePayload(): GameSavePayload {
    return {
      difficulty: this.difficulty,
      tutorial: this.tutorial.progress,
    };
  }

  private loadSavePayload(data: GameSavePayload) {
    this.difficulty = data.difficulty;
    this.tutorial.progress = data.tutorial;
  }

  private registerShaders() {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

    eachEntries(shaders, (name, Shader) => {
      renderer.pipelines.addPostPipeline(name, Shader);
    });
  }
}
