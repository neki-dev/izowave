import { COPYRIGHT } from '~const/core';
import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { MenuItem } from '~type/menu';

import { ComponentItems } from './items';

type Props = {
  menuItems: MenuItem[]
};

export const ComponentMenu = Component<Props>(function (container, {
  menuItems,
}) {
  /**
   * Background
   */

  const background = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.85);

  background.setOrigin(0.0, 0.0);
  useAdaptation(background, (width, height) => {
    background.setSize(width, height);
  });

  container.add(background);

  /**
   * Wrapper
   */

  const wrapper = this.add.container();

  useAdaptation(wrapper, (width, height) => {
    wrapper.setSize(
      Math.min(width * 0.9, 1000),
      Math.min(height * 0.8, 440),
    );
    wrapper.setPosition(
      (width / 2) - (wrapper.width / 2),
      (height / 2) - (wrapper.height / 2),
    );
  });

  container.add(wrapper);

  /**
   * Sidebar
   */

  const sidebar = this.add.container();

  useAdaptation(sidebar, () => {
    sidebar.setSize(
      wrapper.width * 0.3,
      wrapper.height,
    );
  });

  wrapper.add(sidebar);

  /**
   * Sidebar: Logotype
   */

  const logotype = this.add.text(0, 0, 'IZOWAVE', {
    resolution: window.devicePixelRatio,
    color: INTERFACE_TEXT_COLOR.BLUE,
    fontFamily: INTERFACE_FONT.PIXEL,
    shadow: {
      fill: true,
    },
  });

  logotype.setOrigin(1.0, 0.0);
  useAdaptation(logotype, () => {
    logotype.setPosition(sidebar.width, 0);
    scaleText(logotype, {
      by: sidebar.width,
      scale: 0.16,
      shadow: true,
    });
  });

  sidebar.add(logotype);

  /**
   * Sidebar: Menu items
   */

  const items = ComponentItems.call(this, {
    data: menuItems,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    onSelect: (item: MenuItem) => updatePage(item),
  });

  useAdaptation(items, () => {
    const margin = sidebar.height * 0.15;
    const offset = logotype.height + margin;

    items.setSize(sidebar.width, sidebar.height - offset);
    items.setPosition(0, offset);
  });

  sidebar.add(items);

  /**
   * Sidebar: Copyright
   */

  const copyright = this.add.text(0, 0, COPYRIGHT, {
    // resolution: window.devicePixelRatio,
    fontFamily: INTERFACE_FONT.MONOSPACE,
    align: 'right',
  });

  copyright.setOrigin(1.0, 1.0);
  copyright.setAlpha(0.5);
  useAdaptation(copyright, () => {
    copyright.setPosition(sidebar.width, sidebar.height);
    scaleText(copyright, {
      by: sidebar.width,
      scale: 0.04,
    });
  });

  sidebar.add(copyright);

  /**
   * Sidebar: Line
   */

  const line = this.add.rectangle(0, 0, 0, 0, 0xffffff, 0.3);

  line.setOrigin(0.5, 0.0);
  useAdaptation(line, () => {
    line.setSize(1, sidebar.height * 1.4);
    line.setPosition(
      sidebar.width + wrapper.width * 0.09,
      -sidebar.height * 0.2,
    );
  });

  sidebar.add(line);

  /**
   * Page
   */

  const page = this.add.container();

  useAdaptation(page, () => {
    page.setSize(
      wrapper.width * 0.53,
      wrapper.height,
    );
    page.setPosition(
      wrapper.width - page.width,
      0,
    );
  });

  wrapper.add(page);

  /**
   * Page: Title
   */

  const title = this.add.text(0, 0, '', {
    resolution: window.devicePixelRatio,
    fontFamily: INTERFACE_FONT.PIXEL,
    shadow: {
      fill: true,
    },
  });

  title.setAlpha(0.3);
  useAdaptation(title, () => {
    scaleText(title, {
      by: sidebar.width,
      scale: 0.16,
      shadow: true,
    });
  });

  page.add(title);

  /**
   * Page: Content
   */

  const content = this.add.container();

  useAdaptation(content, () => {
    const margin = page.height * 0.15;
    const offset = title.height + margin;

    content.setSize(page.width, page.height - offset);
    content.setPosition(0, offset);
  });

  page.add(content);

  /**
   * Updating
   */

  const updatePage = (item: MenuItem) => {
    title.setText(item.label);

    content.removeAll(true);

    const contentChild = item.content();

    useAdaptation(contentChild, () => {
      contentChild.setSize(content.width, content.height);
    });
    contentChild.refreshAdaptive();

    content.add(contentChild);
  };

  const defaultItem = menuItems.find((item) => item.default);

  if (defaultItem) {
    updatePage(defaultItem);
  }
});
