import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { INTERFACE_FONT } from '~const/interface';
import { getAssetsPack, loadFontFace } from '~lib/assets';
import { removeLoading, setLoadingStatus } from '~lib/state';
import { UI } from '~lib/ui';
import { GameEvents, GameStat, SceneKey } from '~type/game';

import { GameOverUI } from './ui';

import { Game } from '~game';

export class Basic extends Phaser.Scene {
  readonly game: Game;

  /**
   * Basic constructor.
   */
  constructor() {
    super({
      key: SceneKey.BASIC,
      pack: getAssetsPack(),
    });

    setLoadingStatus('ASSETS LOADING');
  }

  /**
   * Create basic.
   */
  public async create() {
    await loadFontFace(INTERFACE_FONT.PIXEL, 'retro');

    this.scene.launch(SceneKey.WORLD);
    this.scene.launch(SceneKey.MENU);

    this.scene.bringToTop();

    this.input.keyboard.on(CONTROL_KEY.PAUSE, () => {
      if (this.game.finished) {
        this.game.restartGame();
      } else if (this.game.started) {
        if (this.game.paused) {
          this.game.resumeGame();
        } else {
          this.game.pauseGame();
        }
      }
    });

    this.game.events.on(GameEvents.FINISH, (stat: GameStat, record: Nullable<GameStat>) => {
      const ui = new UI(this, GameOverUI, { stat, record });

      this.game.events.once(GameEvents.START, () => {
        ui.destroy();
      });
    });

    removeLoading();
  }
}
