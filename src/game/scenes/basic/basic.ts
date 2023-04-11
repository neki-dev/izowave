import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { getAssetsPack, loadFontFace } from '~lib/assets';
import { removeLoading, setLoadingStatus } from '~lib/state';
import {
  GameEvents, GameStat, IGame, IScene, GameScene,
} from '~type/game';
import { InterfaceFont } from '~type/interface';

export class Basic extends Phaser.Scene implements IScene {
  readonly game: IGame;

  constructor() {
    super({
      key: GameScene.BASIC,
      pack: getAssetsPack(),
    });

    setLoadingStatus('ASSETS LOADING');
  }

  public async create() {
    await loadFontFace(InterfaceFont.PIXEL, 'retro');

    this.scene.launch(GameScene.WORLD);
    this.scene.launch(GameScene.MENU);

    this.scene.bringToTop();

    this.input.keyboard.on(CONTROL_KEY.PAUSE, () => {
      if (this.game.isFinished) {
        this.game.restartGame();
      } else if (this.game.isStarted) {
        if (this.game.isPaused) {
          this.game.resumeGame();
        } else {
          this.game.pauseGame();
        }
      }
    });

    removeLoading();

    this.game.events.on(GameEvents.FINISH, (stat: GameStat, record: Nullable<GameStat>) => {
      this.scene.launch(GameScene.GAMEOVER, { stat, record });

      this.game.events.once(GameEvents.START, () => {
        this.scene.stop(GameScene.GAMEOVER);
      });
    });
  }
}
