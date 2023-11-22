import Phaser from 'phaser';

import {
  AUDIO_VOLUME, CONTAINER_ID, DEBUG_MODS,
} from '~const/game';
import { registerShaders } from '~lib/shader';
import { Storage } from '~lib/storage';
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
  GameSavePayload,
  GameScene,
  GameSettings,
  GameStat,
  GameState,
  IGame,
} from '~type/game';
import { MenuPage } from '~type/menu';
import { IScreen } from '~type/screen';
import { StorageSave } from '~type/storage';
import { IWorld } from '~type/world';

export class Game extends Phaser.Game implements IGame {
  public difficulty: GameDifficulty = GameDifficulty.NORMAL;

  private isSaved: boolean = false;

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

  public usedSave: Nullable<StorageSave> = null;

  private sessionsCount: number = 0;

  constructor() {
    super({
      scene: [System, World, Screen, Menu, Gameover],
      pixelArt: true,
      autoRound: true,
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

    this.readSettings();

    if (!this.isSettingEnabled(GameSettings.TUTORIAL)) {
      Tutorial.Disable();
    }

    this.events.on(Phaser.Core.Events.READY, () => {
      registerShaders(this.renderer);

      this.screen = <IScreen> this.scene.getScene(GameScene.SCREEN);
      this.world = <IWorld> this.scene.getScene(GameScene.WORLD);

      this.sound.setVolume(AUDIO_VOLUME);
      this.sound.mute = !this.isSettingEnabled(GameSettings.AUDIO);
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

    window.addEventListener('beforeunload', (event: Event) => {
      const needConfirm = (
        this.state === GameState.STARTED
        || (this.state === GameState.PAUSED && !this.isSaved)
      );

      if (needConfirm && ENV_MODE !== 'development') {
        event.preventDefault();
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        event.returnValue = 'Do you confirm to leave game?';
      }
    });

    window.addEventListener('contextmenu', (event: Event) => {
      event.preventDefault();
    });
  }

  public pauseGame() {
    if (this.state !== GameState.STARTED) {
      return;
    }

    this.setState(GameState.PAUSED);

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

    this.setState(GameState.STARTED);

    this.scene.systemScene.scene.stop(GameScene.MENU);

    this.world.scene.resume();
    this.screen.scene.resume();

    this.isSaved = false;
  }

  public continueGame(save: StorageSave) {
    if (this.state !== GameState.IDLE) {
      return;
    }

    this.usedSave = save;

    this.startGame();
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

    if (this.sessionsCount === 0) {
      this.triggerFullscreen();
    }

    this.sessionsCount++;

    if (this.usedSave) {
      this.loadSavePayload(this.usedSave.payload.game);
      this.world.scene.restart(this.usedSave.payload.level);
    } else {
      Tutorial.Reset();
      this.world.scene.restart();
    }

    this.world.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.setState(GameState.STARTED);

      this.scene.systemScene.scene.stop(GameScene.MENU);
      this.scene.systemScene.scene.launch(GameScene.SCREEN);

      this.world.start();
    });
  }

  public stopGame(menu: boolean = true) {
    if (this.state === GameState.IDLE) {
      return;
    }

    this.scene.systemScene.scene.stop(GameScene.SCREEN);
    this.scene.systemScene.scene.stop(GameScene.MENU);
    this.scene.systemScene.scene.stop(GameScene.GAMEOVER);

    this.setState(GameState.IDLE);

    if (menu) {
      this.world.scene.restart();
      this.scene.systemScene.scene.launch(GameScene.MENU, {
        defaultPage: MenuPage.NEW_GAME,
      });
    }
  }

  public restartGame() {
    if (this.state === GameState.IDLE) {
      return;
    }

    this.stopGame(false);
    this.startGame();
  }

  public finishGame() {
    if (this.state !== GameState.STARTED) {
      return;
    }

    this.setState(GameState.FINISHED);

    this.events.emit(GameEvents.FINISH);

    const record = this.getRecordStat();
    const stat = this.getCurrentStat();

    this.writeBestStat(stat, record);

    this.scene.systemScene.scene.stop(GameScene.SCREEN);
    this.scene.systemScene.scene.launch(GameScene.GAMEOVER, { stat, record });
  }

  public toggleSystemPause(state: boolean) {
    this.events.emit(GameEvents.TOGGLE_PAUSE, state);

    if (state) {
      this.pause();
    } else {
      this.resume();
    }
  }

  private setState(state: GameState) {
    if (this.state === state) {
      return;
    }

    const prevPauseState = this.state !== GameState.STARTED;
    const nextPauseState = state !== GameState.STARTED;

    this.state = state;

    if (prevPauseState !== nextPauseState) {
      this.events.emit(GameEvents.TOGGLE_PAUSE, nextPauseState);
    }
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

  private triggerFullscreen() {
    if (
      this.scale.isFullscreen
      || this.isDesktop()
      || ENV_MODE === 'development'
    ) {
      return;
    }

    try {
      this.scale.startFullscreen();
    } catch (error) {
      //
    }
  }

  public getRecordStat(): Nullable<GameStat> {
    try {
      const recordValue = localStorage.getItem(this.getStatStorageKey());

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

    localStorage.setItem(this.getStatStorageKey(), JSON.stringify(betterStat));
  }

  private getCurrentStat(): GameStat {
    return {
      score: this.world.player.score,
      waves: this.world.wave.number - 1,
      kills: this.world.player.kills,
      lived: this.world.getTime() / 1000 / 60,
    };
  }

  private getStatStorageKey() {
    return `BEST_STAT.${this.world.level.planet}.${this.difficulty}`;
  }

  public async saveGame(name: string) {
    const record = this.getRecordStat();
    const stat = this.getCurrentStat();

    this.writeBestStat(stat, record);

    const save = await Storage.AddSave(this, name);

    if (save) {
      this.isSaved = true;
      this.usedSave = save;
    }

    return save;
  }

  public getSavePayload(): GameSavePayload {
    return {
      difficulty: this.difficulty,
      tutorial: Tutorial.Progress,
    };
  }

  private loadSavePayload(data: GameSavePayload) {
    this.difficulty = data.difficulty;
    Tutorial.Load(data.tutorial);
  }
}
