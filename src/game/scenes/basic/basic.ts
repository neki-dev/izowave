import Phaser from 'phaser';

import { INTERFACE_FONT } from '~const/interface';
import { getAssetsPack, loadFontFace } from '~lib/assets';
import { removeLoading, setLoadingStatus } from '~lib/state';
import { SceneKey } from '~type/game';

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

    removeLoading();
  }
}
