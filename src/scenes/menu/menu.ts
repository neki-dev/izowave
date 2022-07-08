import Phaser from 'phaser';
import { adaptiveSize } from '~lib/ui';
import World from '~scene/world';
import ComponentAbout from '~scene/menu/components/about';
import ComponentDifficulty from '~scene/menu/components/difficulty';
import ComponentControls from '~scene/menu/components/controls';
import ComponentItems, { MenuItem } from '~scene/menu/components/items';

import { SceneKey } from '~type/scene';

import { INTERFACE_FONT_MONOSPACE, INTERFACE_FONT_PIXEL } from '~const/interface';
import { COPYRIGHT } from '~const/core';
import { INPUT_KEY } from '~const/keyboard';

const CONTENT_WIDTH = 500;
const CONTENT_MARGIN = 200;

export default class Menu extends Phaser.Scene {
  private container: Phaser.GameObjects.Container;

  constructor() {
    super(SceneKey.MENU);
  }

  public create({ asPause = false }) {
    const menuItems = [{
      label: asPause ? 'Continue' : 'New game',
      onClick: () => this.startGame(asPause),
    }, {
      label: 'Difficulty',
      content: () => ComponentDifficulty.call(this, { x: 0, y: 0 }, { disabled: asPause }),
    }, {
      label: 'About',
      content: () => ComponentAbout.call(this, { x: 0, y: 0 }),
      default: true,
    }, {
      label: 'Controls',
      content: () => ComponentControls.call(this, { x: 0, y: 0 }),
    }];

    const background = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.85);
    background.setOrigin(0.0, 0.0);

    this.container = this.add.container(0, 0);

    const shift = { x: 0, y: 0 };
    const logotype = this.add.text(shift.x, shift.y, 'IZOWAVE', {
      color: '#8a53d4',
      fontSize: '50px',
      fontFamily: INTERFACE_FONT_PIXEL,
      padding: { bottom: 6 },
      shadow: {
        offsetX: 6,
        offsetY: 6,
        color: '#000',
        blur: 0,
        fill: true,
      },
    });
    shift.y += logotype.height + 80;

    const items = ComponentItems.call(this, shift, {
      width: logotype.width,
      data: menuItems,
      onSelect: (item: MenuItem) => this.updateContent(item),
    });
    shift.y += items.height + 100;

    const copyright = this.add.text(shift.x, shift.y, COPYRIGHT, {
      fixedWidth: logotype.width,
      fontSize: '12px',
      fontFamily: INTERFACE_FONT_MONOSPACE,
      align: 'right',
    });
    copyright.setAlpha(0.5);
    shift.y += copyright.height;
    shift.x = logotype.width;

    this.container.setSize(shift.x + CONTENT_MARGIN + CONTENT_WIDTH, shift.y);

    const line = this.add.rectangle(shift.x + CONTENT_MARGIN / 2, -100, 1, shift.y + 200, 0xffffff, 0.3);
    line.setOrigin(0.0, 0.0);
    shift.x += CONTENT_MARGIN;
    shift.y = 0;

    const title = this.add.text(shift.x, shift.y, '', {
      fontSize: '50px',
      fontFamily: INTERFACE_FONT_PIXEL,
      padding: { bottom: 6 },
      shadow: {
        offsetX: 6,
        offsetY: 6,
        color: '#000',
        blur: 0,
        fill: true,
      },
    });
    title.setAlpha(0.3);
    title.setName('Title');

    shift.y += title.height + 80;

    const content = this.add.container(shift.x, shift.y);
    content.setName('Content');

    this.container.add([logotype, items, copyright, line, title, content]);

    const adaptive = adaptiveSize((width, height) => {
      background.setSize(width, height);
      this.container.setPosition(width / 2 - this.container.width / 2, height / 2 - this.container.height / 2);
    });

    this.container.on(Phaser.GameObjects.Events.DESTROY, () => {
      adaptive.cancel();
    });

    const defaultItem = menuItems.find((item) => item.default);
    if (defaultItem) {
      this.updateContent(defaultItem);
    }

    this.input.keyboard.once(INPUT_KEY.START, () => {
      this.startGame(asPause);
    });
    if (asPause) {
      this.input.keyboard.once(INPUT_KEY.PAUSE, () => {
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
    const title = <Phaser.GameObjects.Text> this.container.getByName('Title');
    title.setText(item.label);

    const content = <Phaser.GameObjects.Container> this.container.getByName('Content');
    content.each((child: Phaser.GameObjects.GameObject) => {
      child.destroy();
    });

    const value = item.content();
    content.add(value);
    content.setSize(value.width, value.height);
  }
}
