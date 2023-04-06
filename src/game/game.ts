import Phaser from 'phaser';

import { AUDIO_VOLUME, CONTAINER_ID } from '~const/game';
import { DIFFICULTY_POWERS } from '~const/world/difficulty';
import { Analytics } from '~game/analytics';
import { Tutorial } from '~game/tutorial';
import { shaders } from '~lib/shaders';
import { eachEntries } from '~lib/system';
import { Basic } from '~scene/basic';
import { Gameover } from '~scene/gameover';
import { Menu } from '~scene/menu';
import { Screen } from '~scene/screen';
import { World } from '~scene/world';
import { IAnalytics } from '~type/analytics';
import {
  GameDifficulty, GameEvents, GameStat, IGame,
} from '~type/game';
import { IMenu } from '~type/menu';
import { IScreen } from '~type/screen';
import { ITutorial } from '~type/tutorial';
import { IWorld } from '~type/world';

export class Game extends Phaser.Game implements IGame {
  readonly tutorial: ITutorial;

  readonly analytics: IAnalytics;

  private _isStarted: boolean = false;

  public get isStarted() { return this._isStarted; }

  private set isStarted(v) { this._isStarted = v; }

  private _isPaused: boolean = false;

  public get isPaused() { return this._isPaused; }

  private set isPaused(v) { this._isPaused = v; }

  private _isFinished: boolean = false;

  public get isFinished() { return this._isFinished; }

  private set isFinished(v) { this._isFinished = v; }

  private _difficultyType: GameDifficulty;

  public get difficultyType() { return this._difficultyType; }

  private set difficultyType(v) { this._difficultyType = v; }

  private _difficulty: number;

  public get difficulty() { return this._difficulty; }

  private set difficulty(v) { this._difficulty = v; }

  private _menu: IMenu;

  public get menu() { return this._menu; }

  private set menu(v) { this._menu = v; }

  private _screen: IScreen;

  public get screen() { return this._screen; }

  private set screen(v) { this._screen = v; }

  private _world: IWorld;

  public get world() { return this._world; }

  private set world(v) { this._world = v; }

  constructor() {
    super({
      scene: [Basic, World, Screen, Menu, Gameover],
      pixelArt: true,
      autoRound: true,
      disableContextMenu: true,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: CONTAINER_ID,
      backgroundColor: '#222',
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      physics: {
        default: 'arcade',
        arcade: {
          // debug: IS_DEV_MODE,
          fps: 60,
          gravity: { y: 0 },
        },
      },
    });

    this.tutorial = new Tutorial();
    this.analytics = new Analytics();

    this.readAndUpdateDifficulty();

    this.events.on(Phaser.Core.Events.READY, () => {
      this.screen = <Screen> this.scene.keys.SCREEN;
      this.menu = <Menu> this.scene.keys.MENU;
      this.world = <World> this.scene.keys.WORLD;

      this.sound.setVolume(AUDIO_VOLUME);

      this.registerShaders();
    });
  }

  public pauseGame() {
    this.isPaused = true;

    this.world.scene.pause();
    this.screen.scene.pause();

    this.scene.systemScene.scene.launch(this.menu);
  }

  public resumeGame() {
    this.isPaused = false;

    this.scene.systemScene.scene.stop(this.menu);

    this.world.scene.resume();
    this.screen.scene.resume();
  }

  public startGame() {
    this.isFinished = false;
    this.isStarted = true;

    this.world.start();

    this.scene.systemScene.scene.stop(this.menu);
    this.scene.systemScene.scene.launch(this.screen);

    this.events.emit(GameEvents.START);

    if (!IS_DEV_MODE) {
      window.onbeforeunload = function confirmLeave() {
        return 'Leave game? No saves!';
      };
    }
  }

  public stopGame() {
    this.isStarted = false;

    this.scene.systemScene.scene.stop(this.menu);
    this.scene.systemScene.scene.stop(this.screen);

    this.tutorial.disable();

    if (!IS_DEV_MODE) {
      delete window.onbeforeunload;
    }
  }

  public restartGame() {
    if (this.isStarted) {
      this.stopGame();
    }

    this.world.scene.restart();

    this.world.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.startGame();
    });
  }

  public finishGame() {
    this.stopGame();

    this.isFinished = true;

    const record = this.readBestStat();
    const stat = this.getCurrentStat();

    if (!IS_DEV_MODE) {
      this.writeBestStat(stat, record);
    }

    this.events.emit(GameEvents.FINISH, stat, record);

    this.analytics.track({
      world: this.world,
      success: false,
    });
  }

  public setDifficulty(type: GameDifficulty) {
    localStorage.setItem('DIFFICULTY', type);

    this.difficultyType = type;
    this.difficulty = DIFFICULTY_POWERS[this.difficultyType];
  }

  private readAndUpdateDifficulty() {
    const difficultyType = <GameDifficulty> localStorage.getItem('DIFFICULTY') || GameDifficulty.NORMAL;

    this.setDifficulty(difficultyType);
  }

  private readBestStat(): Nullable<GameStat> {
    try {
      const recordValue = localStorage.getItem(`BEST_STAT.${this.difficultyType}`);

      return JSON.parse(recordValue);
    } catch (error) {
      return null;
    }
  }

  private writeBestStat(stat: GameStat, record: Nullable<GameStat>) {
    localStorage.setItem(`BEST_STAT.${this.difficultyType}`, JSON.stringify(
      Object.keys(stat).reduce((curr, param: keyof GameStat) => ({
        ...curr,
        [param]: Math.max(stat[param], record?.[param] ?? 0),
      }), {}),
    ));
  }

  private getCurrentStat() {
    return {
      waves: this.world.wave.getTargetNumber() - 1,
      kills: this.world.player.kills,
      level: this.world.player.level,
      lived: this.world.getTime() / 1000 / 60,
    } as GameStat;
  }

  private registerShaders() {
    const renderer = <Phaser.Renderer.WebGL.WebGLRenderer> this.renderer;

    eachEntries(shaders, (name, Shader) => {
      renderer.pipelines.addPostPipeline(name, Shader);
    });
  }
}
