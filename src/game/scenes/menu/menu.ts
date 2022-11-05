import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { registerAudioAssets } from '~lib/assets';
import { ComponentAbout } from '~scene/menu/components/content/about';
import { ComponentControls } from '~scene/menu/components/content/controls';
import { ComponentDifficulty } from '~scene/menu/components/content/difficulty';
import { ComponentMenu } from '~scene/menu/components/menu';
import { Level } from '~scene/world/level';
import { SceneKey } from '~type/game';
import { MenuAudio } from '~type/menu';

import { Game } from '~game';

export class Menu extends Phaser.Scene {
  readonly game: Game;

  constructor() {
    super(SceneKey.MENU);
  }

  public create() {
    ComponentMenu(this, {
      menuItems: [...(this.game.paused ? [{
        label: 'Continue',
        onClick: () => {
          this.game.resumeGame();
        },
      }, {
        label: 'Restart',
        onClick: () => {
          // eslint-disable-next-line no-alert
          if (window.confirm('Do you confirm start new game?')) {
            this.game.restartGame();
          }
        },
      }] : [{
        label: 'New game',
        onClick: () => {
          this.game.startGame();
        },
      }]), {
        label: 'Difficulty',
        content: () => ComponentDifficulty(this, {
          disabled: this.game.paused,
        }),
      }, {
        label: 'About',
        content: () => ComponentAbout(this),
        active: true,
      }, {
        label: 'Controls',
        content: () => ComponentControls(this),
      }].filter((item) => item),
    });

    if (!this.game.paused) {
      this.setCameraPreview();

      this.input.keyboard.once(CONTROL_KEY.START, () => {
        this.game.startGame();
      });
    }
  }

  private setCameraPreview() {
    const from = Level.ToWorldPosition({
      x: 0,
      y: this.game.world.level.size - 1,
      z: 0,
    });
    const to = Level.ToWorldPosition({
      x: this.game.world.level.size - 1,
      y: 0,
      z: 0,
    });

    this.game.world.cameras.main.setZoom(1.8);
    this.game.world.cameras.main.pan(from.x + (this.sys.canvas.width / 2), from.y, 0);
    setTimeout(() => {
      this.game.world.cameras.main.pan(to.x - (this.sys.canvas.width / 2), to.y, 2 * 60 * 1000);
    }, 0);
  }
}

registerAudioAssets(MenuAudio);
