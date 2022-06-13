import Phaser from 'phaser';
import { loadFontFace } from '~lib/assets';
import World from '~scene/world';
import ComponentLogotype from '~scene/menu/components/logotype';
import ComponentAbout from '~scene/menu/components/about';
import ComponentDifficulty from '~scene/menu/components/difficulty';
import ComponentControls from '~scene/menu/components/controls';
import ComponentCopyright from '~scene/menu/components/copyright';
import ComponentTitle from '~scene/menu/components/title';
import ComponentContent from '~scene/menu/components/content';
import ComponentItems, { MenuItem } from '~scene/menu/components/items';

import { SceneKey } from '~type/scene';
import { INTERFACE_PIXEL_FONT } from '~const/interface';

const MENU_WIDTH = 300;
const CONTENT_MARGIN = 200;

export default class Menu extends Phaser.Scene {
  private container: Phaser.GameObjects.Container;

  constructor() {
    super(SceneKey.MENU);
  }

  public create({ asPause = false }) {
    this.addBackground();

    loadFontFace(INTERFACE_PIXEL_FONT, 'retro').finally(() => {
      this.addMenu([{
        label: asPause ? 'Continue' : 'New game',
        onClick: () => this.startGame(asPause),
      }, {
        label: 'Difficulty',
        content: () => ComponentDifficulty.call(this, { disabled: asPause }),
      }, {
        label: 'About',
        content: () => ComponentAbout.call(this),
        default: true,
      }, {
        label: 'Controls',
        content: () => ComponentControls.call(this),
      }]);
    });

    this.input.keyboard.once('keyup-ENTER', () => {
      this.startGame(asPause);
    });
    if (asPause) {
      this.input.keyboard.once('keyup-ESC', () => {
        this.startGame(true);
      });
    }
  }

  private startGame(afterPause: boolean) {
    const world = <World> this.scene.get(SceneKey.WORLD);
    if (afterPause) {
      world.toggleGamePause(false);
    } else {
      world.startGame();
    }
  }

  private updateContent(item: MenuItem) {
    const title = <Phaser.GameObjects.Text> this.container.getByName('ComponentTitle');
    title.setText(item.label);

    const content = <Phaser.GameObjects.Container> this.container.getByName('ComponentContent');
    content.each((child: Phaser.GameObjects.GameObject) => {
      child.destroy();
    });

    const value = item.content();
    content.add(value);
    content.setSize(value.width, value.height);
  }

  private addMenu(data: any[]) {
    this.container = this.add.container(0, 0);

    let shift = 0;
    const logotype = ComponentLogotype.call(this, { x: 0, y: shift, width: MENU_WIDTH });
    const title = ComponentTitle.call(this, { x: MENU_WIDTH + CONTENT_MARGIN, y: shift });
    shift += logotype.height + 100;
    const items = ComponentItems.call(this, {
      x: 0,
      y: shift,
      width: MENU_WIDTH,
      data,
      onSelect: (item: MenuItem) => this.updateContent(item),
    });
    const content = ComponentContent.call(this, { x: MENU_WIDTH + CONTENT_MARGIN, y: shift - 4 });
    shift += items.height + 100;
    const copyright = ComponentCopyright.call(this, { x: 0, y: shift, width: MENU_WIDTH });
    shift += copyright.height;
    const line = this.addDelimetr(shift);

    this.container.add([logotype, items, copyright, line, title, content]);

    const defaultItem = data.find((item) => item.default);
    if (defaultItem) {
      this.updateContent(defaultItem);
    }

    this.container.setSize(MENU_WIDTH + CONTENT_MARGIN + content.width, shift);
    this.container.setPosition(
      this.sys.canvas.width / 2 - this.container.width / 2,
      this.sys.canvas.height / 2 - this.container.height / 2,
    );
  }

  private addBackground() {
    return this.add.rectangle(
      0,
      0,
      this.sys.canvas.width,
      this.sys.canvas.height,
      0x000000,
      0.85,
    ).setOrigin(0, 0);
  }

  private addDelimetr(height: number) {
    return this.add.rectangle(
      MENU_WIDTH + CONTENT_MARGIN / 2,
      -100,
      1,
      height + 200,
      0xffffff,
      0.3,
    )
      .setOrigin(0, 0);
  }
}
