import { COPYRIGHT } from '~const/core';
import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import {
  useAdaptation, Component, scaleText, refreshAdaptive,
} from '~lib/interface';
import { MenuItem } from '~type/menu';

import { ComponentItems } from './items';

type Props = {
  menuItems: MenuItem[]
};

export const ComponentMenu = Component<Props>(function (container, {
  menuItems,
}) {
  const ref: {
    background?: Phaser.GameObjects.Rectangle
    wrapper?: Phaser.GameObjects.Container
    sidebar?: Phaser.GameObjects.Container
    logotype?: Phaser.GameObjects.Text
    items?: Phaser.GameObjects.Container
    copyright?: Phaser.GameObjects.Text
    line?: Phaser.GameObjects.Rectangle
    page?: Phaser.GameObjects.Container
    title?: Phaser.GameObjects.Text
    content?: Phaser.GameObjects.Container
  } = {};

  /**
   * Background
   */

  container.add(
    ref.background = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.85),
  );

  ref.background.setOrigin(0.0, 0.0);
  useAdaptation(ref.background, (width, height) => {
    ref.background.setSize(width, height);
  });

  /**
   * Wrapper
   */

  container.add(
    ref.wrapper = this.add.container(),
  );

  useAdaptation(ref.wrapper, (width, height) => {
    ref.wrapper.setSize(
      Math.min(width * 0.9, 1000),
      Math.min(height * 0.8, 440),
    );
    ref.wrapper.setPosition(
      (width / 2) - (ref.wrapper.width / 2),
      (height / 2) - (ref.wrapper.height / 2),
    );
  });

  /**
   * Sidebar
   */

  ref.wrapper.add(
    ref.sidebar = this.add.container(),
  );

  useAdaptation(ref.sidebar, () => {
    ref.sidebar.setSize(
      ref.wrapper.width * 0.3,
      ref.wrapper.height,
    );
  });

  /**
   * Sidebar: Logotype
   */

  ref.sidebar.add(
    ref.logotype = this.add.text(0, 0, 'IZOWAVE', {
      resolution: window.devicePixelRatio,
      color: INTERFACE_TEXT_COLOR.BLUE,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.logotype.setOrigin(1.0, 0.0);
  useAdaptation(ref.logotype, () => {
    scaleText(ref.logotype, 40, true);
    ref.logotype.setPosition(
      ref.sidebar.width,
      0,
    );
  });

  /**
   * Sidebar: Menu items
   */

  ref.sidebar.add(
    ref.items = ComponentItems(this, {
      data: menuItems,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      onSelect: (index: number) => updatePage(menuItems[index]),
    }),
  );

  useAdaptation(ref.items, () => {
    const margin = ref.sidebar.height * 0.15;
    const offset = ref.logotype.height + margin;

    ref.items.setSize(
      ref.sidebar.width,
      ref.sidebar.height - offset,
    );
    ref.items.setPosition(0, offset);
  });

  /**
   * Sidebar: Copyright
   */

  ref.sidebar.add(
    ref.copyright = this.add.text(0, 0, COPYRIGHT, {
      // resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
      align: 'right',
    }),
  );

  ref.copyright.setOrigin(1.0, 1.0);
  ref.copyright.setAlpha(0.5);
  useAdaptation(ref.copyright, () => {
    scaleText(ref.copyright, 10);
    ref.copyright.setPosition(
      ref.sidebar.width,
      ref.sidebar.height,
    );
  });

  /**
   * Sidebar: Line
   */

  ref.sidebar.add(
    ref.line = this.add.rectangle(0, 0, 0, 0, 0xffffff, 0.3),
  );

  ref.line.setOrigin(0.5, 0.0);
  useAdaptation(ref.line, () => {
    ref.line.setSize(
      1,
      ref.sidebar.height * 1.4,
    );
    ref.line.setPosition(
      ref.sidebar.width + ref.wrapper.width * 0.09,
      -ref.sidebar.height * 0.2,
    );
  });

  /**
   * Page
   */

  ref.wrapper.add(
    ref.page = this.add.container(),
  );

  useAdaptation(ref.page, () => {
    ref.page.setSize(
      ref.wrapper.width * 0.53,
      ref.wrapper.height,
    );
    ref.page.setPosition(
      ref.wrapper.width - ref.page.width,
      0,
    );
  });

  /**
   * Page: Title
   */

  ref.page.add(
    ref.title = this.add.text(0, 0, '', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.title.setAlpha(0.3);
  useAdaptation(ref.title, () => {
    scaleText(ref.title, 40, true);
  });

  /**
   * Page: Content
   */

  ref.page.add(
    ref.content = this.add.container(),
  );

  useAdaptation(ref.content, () => {
    const margin = ref.page.height * 0.15;
    const offset = ref.title.height + margin;

    ref.content.setSize(
      ref.page.width,
      ref.page.height - offset,
    );
    ref.content.setPosition(0, offset);
  });

  /**
   * Updating
   */

  const updatePage = (item: MenuItem) => {
    ref.title.setText(item.label);

    ref.content.removeAll(true);

    const contentChild = item.content();

    useAdaptation(contentChild, () => {
      contentChild.setSize(
        ref.content.width,
        ref.content.height,
      );
    });
    refreshAdaptive(contentChild);

    ref.content.add(contentChild);
  };

  const defaultItem = menuItems.find((item) => item.active);

  if (defaultItem) {
    updatePage(defaultItem);
  }
});
