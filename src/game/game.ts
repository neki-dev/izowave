import Phaser from 'phaser';

import {
  AUDIO_VOLUME, CONTAINER_ID, DEBUG_MODS,
} from '~const/game';
import { Analytics } from '~lib/analytics';
import { SDK } from '~lib/sdk';
import { Tutorial } from '~lib/tutorial';
import { eachEntries } from '~lib/utils';
import { Gameover } from '~scene/gameover';
import { Menu } from '~scene/menu';
import { Screen } from '~scene/screen';
import { System } from '~scene/system';
import { World } from '~scene/world';
import {
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
import { SDKAdsType } from '~type/sdk';
import { StorageSave } from '~type/storage';
import { IWorld } from '~type/world';

import { shaders } from '../shaders';

export class Game extends Phaser.Game implements IGame {
  private flags: string[];

  public difficulty: GameDifficulty = GameDifficulty.NORMAL;

  public isSaved: boolean = false;

  private _state: GameState = GameState.IDLE;

  public get state() { return this._state; }

  private set state(v) { this._state = v; }

  private _screen: IScreen;

  public get screen() { return this._screen; }

  private set screen(v) { this._screen = v; }

  private _world: IWorld;

  public get world() { return this._world; }

  private set world(v) { this._world = v; }

  private _settings: Record<GameSettings, boolean> = {
    [GameSettings.AUDIO]: true,
    [GameSettings.TUTORIAL]: true,
    [GameSettings.EFFECTS]: true,
    [GameSettings.SHOW_DAMAGE]: true,
  };

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

    Analytics.Register();

    SDK.ToggleLoadState(true);

    this.readFlags();
    this.readSettings();

    this.events.on(Phaser.Core.Events.READY, () => {
      this.screen = <IScreen> this.scene.getScene(GameScene.SCREEN);
      this.world = <IWorld> this.scene.getScene(GameScene.WORLD);

      this.sound.setVolume(AUDIO_VOLUME);
      this.sound.mute = !this.isSettingEnabled(GameSettings.AUDIO);

      this.registerShaders();
    });

    this.events.on(`${GameEvents.UPDATE_SETTINGS}.${GameSettings.AUDIO}`, (enabled: boolean) => {
      this.sound.mute = !enabled;
    });

    this.events.on(`${GameEvents.UPDATE_SETTINGS}.${GameSettings.TUTORIAL}`, (enabled: boolean) => {
      if (enabled) {
        Tutorial.Enable();
      } else {
        Tutorial.Disable();
      }
    });

    window.onbeforeunload = () => {
      const needConfirm = !IS_DEV_MODE && (
        (this.state === GameState.PAUSED && !this.isSaved)
        || this.state === GameState.STARTED
      );

      return needConfirm
        ? 'Do you confirm leave game without save?'
        : undefined;
    };

    window.onerror = (message, path, line, column, error) => {
      if (error) {
        Analytics.TrackError(error);
      } else if (typeof message === 'string') {
        Analytics.TrackError(new Error(message));
      }

      return false;
    };
  }

  public pauseGame() {
    if (this.state !== GameState.STARTED) {
      return;
    }

    this.state = GameState.PAUSED;

    SDK.TogglePlayState(false);

    this.world.scene.pause();
    this.screen.scene.pause();

    this.scene.systemScene.scene.launch(GameScene.MENU, {
      defaultPage: this.isDesktop()
        ? MenuPage.CONTROLS
        : MenuPage.ABOUT_GAME,
    });
  }

  public resumeGame() {
    if (this.state !== GameState.PAUSED) {
      return;
    }

    this.state = GameState.STARTED;

    SDK.TogglePlayState(true);

    this.scene.systemScene.scene.stop(GameScene.MENU);

    this.world.scene.resume();
    this.screen.scene.resume();

    this.isSaved = false;
  }

  public continueGame(save: StorageSave) {
    if (this.state !== GameState.IDLE) {
      return;
    }

    this.showAds(SDKAdsType.MIDGAME);

    this.usedSave = save;

    if (this.usedSave.payload.game) {
      this.loadSavePayload(this.usedSave.payload.game);
    }

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

    if (
      !this.scale.isFullscreen
      && !this.isDesktop()
      && !IS_DEV_MODE
    ) {
      try {
        this.scale.startFullscreen();
      } catch (error) {
        //
      }
    }

    this.state = GameState.STARTED;

    SDK.TogglePlayState(true);

    if (!this.isSettingEnabled(GameSettings.TUTORIAL)) {
      Tutorial.Disable();
    }

    this.scene.systemScene.scene.stop(GameScene.MENU);
    this.scene.systemScene.scene.launch(GameScene.SCREEN);

    this.world.start();
  }

  public stopGame() {
    if (this.state === GameState.IDLE) {
      return;
    }

    if (this.state === GameState.FINISHED) {
      this.showAds(SDKAdsType.MIDGAME);

      this.scene.systemScene.scene.stop(GameScene.GAMEOVER);
    }

    this.state = GameState.IDLE;

    this.world.scene.restart();

    Tutorial.Reset();

    this.scene.systemScene.scene.stop(GameScene.SCREEN);
    this.scene.systemScene.scene.launch(GameScene.MENU, {
      defaultPage: MenuPage.NEW_GAME,
    });
  }

  public finishGame() {
    if (this.state !== GameState.STARTED) {
      return;
    }

    this.state = GameState.FINISHED;

    SDK.TogglePlayState(false);

    this.events.emit(GameEvents.FINISH);

    const record = this.getRecordStat();
    const stat = this.getCurrentStat();

    this.writeBestStat(stat, record);

    this.scene.systemScene.scene.stop(GameScene.SCREEN);
    this.scene.systemScene.scene.launch(GameScene.GAMEOVER, { stat, record });

    Analytics.TrackEvent({
      world: this.world,
      success: false,
    });
  }

  public isDesktop() {
    return this.device.os.desktop;
  }

  public getDifficultyMultiplier() {
    switch (this.difficulty) {
      case GameDifficulty.EASY: return 0.8;
      case GameDifficulty.HARD: return 1.4;
      default: return 1.0;
    }
  }

  public updateSetting(key: GameSettings, value: boolean) {
    this.settings[key] = value;
    localStorage.setItem(`SETTINGS.${key}`, value ? 'on' : 'off');

    this.events.emit(`${GameEvents.UPDATE_SETTINGS}.${key}`, value);
  }

  public isSettingEnabled(key: GameSettings) {
    if (!this.isDesktop() && key === GameSettings.SHOW_DAMAGE) {
      return false;
    }

    return this.settings[key];
  }

  private readSettings() {
    eachEntries(GameSettings, (key) => {
      const userValue = localStorage.getItem(`SETTINGS.${key}`);

      if (userValue) {
        this.settings[key] = userValue === 'on';
      }
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

  public showAds(type: SDKAdsType, callback?: () => void) {
    if (!this.isFlagEnabled(GameFlag.ADS)) {
      return;
    }

    SDK.ShowAds(
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
      tutorial: Tutorial.Progress,
    };
  }

  private loadSavePayload(data: GameSavePayload) {
    this.difficulty = data.difficulty;
    Tutorial.Progress = data.tutorial;
  }

  private registerShaders() {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

    eachEntries(shaders, (name, Shader) => {
      renderer.pipelines.addPostPipeline(name, Shader);
    });
  }
}
