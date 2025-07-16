import Phaser from 'phaser';

import { CONTAINER_ID, AUDIO_VOLUME } from './const';
import { LevelPlanet } from './scenes/world/level/types';
import { GameDifficulty, GameState, GameSettings, GameScene, GameEvent } from './types';
import type { GameStat, GameSavePayload } from './types';

import { registerShaders } from '~core/shader';
import { Storage } from '~core/storage';
import type { StorageSave } from '~core/storage/types';
import { Tutorial } from '~core/tutorial';
import { Utils } from '~core/utils';
import { MenuScene } from '~scene/menu';
import { MenuPage } from '~scene/menu/types';
import { ScreenScene } from '~scene/screen';
import { SystemScene } from '~scene/system';
import { WorldScene } from '~scene/world';

export class Game extends Phaser.Game {
  public difficulty: GameDifficulty = GameDifficulty.NORMAL;

  public planet: LevelPlanet = LevelPlanet.EARTH;

  private saved: boolean = false;

  private _state: GameState = GameState.IDLE;
  public get state() { return this._state; }
  private set state(v) { this._state = v; }

  private _screen: ScreenScene;
  public get screen() { return this._screen; }
  private set screen(v) { this._screen = v; }

  private _world: WorldScene;
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

  constructor() {
    super({
      scene: [SystemScene, WorldScene, ScreenScene, MenuScene],
      pixelArt: true,
      autoRound: true,
      parent: CONTAINER_ID,
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      fps: {
        target: 60,
        forceSetTimeOut: true,
      },
      physics: {
        default: 'arcade',
        arcade: {
          fps: 60,
          gravity: { x: 0, y: 0 },
        },
      },
    });

    this.readSettings();

    if (!this.isSettingEnabled(GameSettings.TUTORIAL)) {
      Tutorial.Disable();
    }

    this.events.on(Phaser.Core.Events.READY, () => {
      registerShaders(this.renderer);

      this.screen = <ScreenScene> this.scene.getScene(GameScene.SCREEN);
      this.world = <WorldScene> this.scene.getScene(GameScene.WORLD);

      this.sound.setVolume(AUDIO_VOLUME);
      this.sound.mute = !this.isSettingEnabled(GameSettings.AUDIO);
    });

    this.events.on(`${GameEvent.UPDATE_SETTINGS}.${GameSettings.AUDIO}`, (enabled: boolean) => {
      this.sound.mute = !enabled;
    });

    this.events.on(`${GameEvent.UPDATE_SETTINGS}.${GameSettings.TUTORIAL}`, (enabled: boolean) => {
      if (enabled) {
        Tutorial.Enable();
      } else {
        Tutorial.Disable();
      }
    });

    window.addEventListener('beforeunload', (event: Event) => {
      const needConfirm = (
        this.state === GameState.STARTED
        || (this.state === GameState.PAUSED && !this.saved)
      );

      if (needConfirm) {
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

    this.launchScene(GameScene.MENU, {
      background: false,
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
    this.stopScene(GameScene.MENU);

    this.world.scene.resume();
    this.screen.scene.resume();

    this.saved = false;
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

    this.stopScene(GameScene.MENU);

    if (this.usedSave) {
      this.loadSavePayload(this.usedSave.payload.game);
      this.launchScene(GameScene.WORLD, this.usedSave.payload.level);
    } else {
      Tutorial.Reset();
      this.launchScene(GameScene.WORLD, { planet: this.planet });
    }

    this.launchScene(GameScene.SCREEN);

    this.setState(GameState.STARTED);
  }

  public stopGame(menu: boolean = true) {
    if (this.state === GameState.IDLE) {
      return;
    }

    this.stopScene(GameScene.WORLD);
    this.stopScene(GameScene.SCREEN);
    this.stopScene(GameScene.MENU);

    this.setState(GameState.IDLE);

    if (menu) {
      this.launchScene(GameScene.MENU, {
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

    this.events.emit(GameEvent.FINISH);

    const record = this.getRecordStat();
    const stat = this.getCurrentStat();

    this.writeBestStat(stat, record);
  }

  public toggleSystemPause(state: boolean) {
    this.events.emit(GameEvent.TOGGLE_PAUSE, state);

    if (state) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public launchScene(key: GameScene, data?: object) {
    this.scene.systemScene.scene.launch(key, data);
  }

  public stopScene(key: GameScene) {
    this.scene.systemScene.scene.stop(key);
  }

  private setState(state: GameState) {
    if (this.state === state) {
      return;
    }

    const prevPauseState = this.state !== GameState.STARTED;
    const nextPauseState = state !== GameState.STARTED;

    this.state = state;

    this.events.emit(GameEvent.CHANGE_STATE, state);

    if (prevPauseState !== nextPauseState) {
      this.events.emit(GameEvent.TOGGLE_PAUSE, nextPauseState);
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

    this.events.emit(`${GameEvent.UPDATE_SETTINGS}.${key}`, value);
  }

  public isSettingEnabled(key: GameSettings) {
    if (!this.isDesktop() && key === GameSettings.SHOW_DAMAGE) {
      return false;
    }

    return this.settings[key];
  }

  private readSettings() {
    Utils.EachObject(GameSettings, (key) => {
      const userValue = localStorage.getItem(`SETTINGS.${key}`);
      if (userValue) {
        this.settings[key] = userValue === 'on';
      }
    });
  }

  public getRecordStat(key?: string): Nullable<GameStat> {
    try {
      const recordValue = localStorage.getItem(key ?? this.getStatStorageKey());
      return recordValue && JSON.parse(recordValue);
    } catch {
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

  public getCurrentStat(): GameStat {
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

  public loadSave(data: StorageSave) {
    this.usedSave = data;
  }

  public async saveGame(name: string) {
    const record = this.getRecordStat();
    const stat = this.getCurrentStat();

    this.writeBestStat(stat, record);

    const save = await Storage.AddSave(this, name);

    if (save) {
      this.saved = true;
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
