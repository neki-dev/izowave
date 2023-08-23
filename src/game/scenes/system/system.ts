import { CONTROL_KEY } from '~const/controls';
import { Scene } from '~game/scenes';
import { getAssetsPack, loadFontFace } from '~lib/assets';
import { removeLoading, setLoadingStatus } from '~lib/state';
import { GameScene, GameState } from '~type/game';
import { InterfaceFont } from '~type/interface';
import { MenuPage } from '~type/menu';

export class System extends Scene {
  constructor() {
    super({
      key: GameScene.SYSTEM,
      pack: getAssetsPack(),
    });

    setLoadingStatus('ASSETS LOADING');
  }

  public async create() {
    await this.game.loadPayload();

    await Promise.all([
      loadFontFace(InterfaceFont.PIXEL_LABEL, 'pixel_label.ttf'),
      loadFontFace(InterfaceFont.PIXEL_TEXT, 'pixel_text.ttf'),
    ]);

    removeLoading();

    this.scene.launch(GameScene.WORLD);
    this.scene.launch(GameScene.MENU, {
      defaultPage: MenuPage.NEW_GAME,
    });

    this.scene.bringToTop();

    this.input.keyboard?.on(CONTROL_KEY.PAUSE, () => {
      if (this.game.isPaused) {
        // System pause
        return;
      }

      switch (this.game.state) {
        case GameState.FINISHED: {
          this.game.stopGame();
          break;
        }
        case GameState.PAUSED: {
          this.game.resumeGame();
          break;
        }
        case GameState.STARTED: {
          this.game.pauseGame();
          break;
        }
      }
    });
  }
}
