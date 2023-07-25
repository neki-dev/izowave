import { CONTROL_KEY } from '~const/controls';
import { Scene } from '~game/scenes';
import { getAssetsPack, loadFontFace } from '~lib/assets';
import { removeLoading, setLoadingStatus } from '~lib/state';
import { GameScene } from '~type/game';
import { InterfaceFont } from '~type/interface';

export class System extends Scene {
  constructor() {
    super({
      key: GameScene.SYSTEM,
      pack: getAssetsPack(),
    });

    setLoadingStatus('ASSETS LOADING');
  }

  public create() {
    Promise.all([
      loadFontFace(InterfaceFont.PIXEL_LABEL, 'pixel_label.ttf'),
      loadFontFace(InterfaceFont.PIXEL_TEXT, 'pixel_text.ttf'),
    ]).then(() => {
      removeLoading();
    });

    this.scene.launch(GameScene.WORLD);
    this.scene.launch(GameScene.MENU);

    this.scene.bringToTop();

    this.input.keyboard?.on(CONTROL_KEY.PAUSE, () => {
      if (this.game.isPaused) {
        // System pause
        return;
      }

      if (this.game.isFinished) {
        this.game.restartGame();
      } else if (this.game.isStarted) {
        if (this.game.onPause) {
          this.game.resumeGame();
        } else {
          this.game.pauseGame();
        }
      }
    });
  }
}
