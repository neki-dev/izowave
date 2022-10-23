import Phaser from 'phaser';
import { INPUT_KEY } from '~const/keyboard';
import { registerAudioAssets } from '~lib/assets';
import { ComponentAbout } from '~scene/menu/components/content/about';
import { ComponentControls } from '~scene/menu/components/content/controls';
import { ComponentDifficulty } from '~scene/menu/components/content/difficulty';
import { ComponentMenu } from '~scene/menu/components/menu';
import { World } from '~scene/world';
import { MenuAudio, MenuItem } from '~type/menu';
import { SceneKey } from '~type/scene';

export class Menu extends Phaser.Scene {
  private pauseMode: boolean = false;

  constructor() {
    super(SceneKey.MENU);
  }

  public create({ pauseMode = false }) {
    this.pauseMode = pauseMode;

    ComponentMenu.call(this, {
      menuItems: <MenuItem[]> [{
        label: this.pauseMode ? 'Continue' : 'New game',
        onClick: () => this.startGame(),
      }, {
        label: 'Difficulty',
        content: () => ComponentDifficulty.call(this, {
          disabled: this.pauseMode,
        }),
      }, {
        label: 'About',
        content: () => ComponentAbout.call(this),
        default: true,
      }, {
        label: 'Controls',
        content: () => ComponentControls.call(this),
      }],
    });

    this.bindKeyboard();
  }

  private bindKeyboard() {
    this.input.keyboard.once(INPUT_KEY.START, () => {
      this.startGame();
    });

    if (this.pauseMode) {
      this.input.keyboard.once(INPUT_KEY.PAUSE, () => {
        this.startGame();
      });
    }
  }

  private startGame() {
    const world = <World> this.scene.get(SceneKey.WORLD);

    if (this.pauseMode) {
      world.toggleGamePause(false);
    } else {
      world.startGame();
    }
  }
}

registerAudioAssets(MenuAudio);
