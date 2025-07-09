import { Scene } from '..';

import { GameScene, GameState } from '~game/types';
import { Assets } from '~lib/assets';
import { CONTROL_KEY } from '~lib/controls/const';
import { InterfaceFont } from '~lib/interface/types';
import { Storage } from '~lib/storage';
import { MenuPage } from '~scene/menu/types';

export class SystemScene extends Scene {
  constructor() {
    super(GameScene.SYSTEM);
  }

  public async preload() {
    this.load.on('progress', (value: number) => {
      SystemScene.SetLoadingStatus(`LOADING\n${Math.round(value * 100)}%`);
    });

    this.load.addPack([{
      files: Assets.Files,
    }]);

    Assets.Clear();

    await Promise.all([
      Assets.ImportFontFace(InterfaceFont.PIXEL_LABEL, 'pixel_label.ttf'),
      Assets.ImportFontFace(InterfaceFont.PIXEL_TEXT, 'pixel_text.ttf'),
    ]);
  }

  public async create() {
    SystemScene.SetLoadingStatus('LOADING\nDONE');

    await Storage.Register()
      .then(() => Storage.LoadSaves());

    this.scene.launch(GameScene.WORLD);
    this.scene.launch(GameScene.MENU, {
      defaultPage: MenuPage.NEW_GAME,
    });

    this.scene.bringToTop();

    SystemScene.RemoveLoading();

    if (!this.game.isDesktop()) {
      this.input.addPointer(1);
    }

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

  private static SetLoadingStatus(text: string) {
    const status = document.getElementById('loading-status');
    if (status) {
      status.innerText = text;
    }
  }

  private static RemoveLoading() {
    const overlay = document.getElementById('loading');
    if (overlay) {
      overlay.remove();
    }
  }
}
