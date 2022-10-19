import { INTERFACE_FONT } from '~const/interface';
import { Component } from '~lib/ui';
import { ScreenTexture } from '~type/screen';
import { BuildingDescriptionItem } from '~type/world/entities/building';

type Props = {
  data: () => BuildingDescriptionItem[]
};

export const ComponentParams = Component<Props>(function (container, {
  data,
}) {
  const value: {
    current: string
  } = { current: null };

  const refreshWrapper = (wrapper: Phaser.GameObjects.Container): number => {
    const text = <Phaser.GameObjects.Text> wrapper.getByName('Text');

    // eslint-disable-next-line no-param-reassign
    wrapper.height = text.height;

    return wrapper.y + wrapper.height;
  };

  const create = (item: BuildingDescriptionItem, index: number) => {
    /**
     * Wrapper
     */

    const wrapper = this.add.container();

    wrapper.adaptive = () => {
      let offset = 0;

      if (index > 0) {
        // Get offset by previon wrapper
        const offsetY = container.width * 0.025;
        const prevWrapper = <Phaser.GameObjects.Container> container.getAt(index - 1);

        offset += refreshWrapper(prevWrapper) + offsetY;
      }

      wrapper.width = container.width;
      wrapper.setPosition(0, offset);
    };

    container.add(wrapper);

    /**
     * Icon
     */

    let icon: Phaser.GameObjects.Image;

    if (item.icon !== undefined) {
      icon = this.add.image(0, 0, ScreenTexture.ICON, item.icon);

      icon.setOrigin(0.0, 0.0);

      wrapper.add(icon);
    }

    /**
     * Text
     */

    const text = this.add.text(0, -1, item.text, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
      color: item.color || '#fff',
    });

    text.setName('Text');
    text.adaptive = () => {
      const fontSize = wrapper.width / 250;
      const padding = (item.type === 'text') ? 8 : 0;

      text.setFontSize(`${fontSize}rem`);
      text.setX(icon ? (icon.width + 5) : 0);
      text.setPadding(0, 0, 0, padding);
    };

    wrapper.add(text);

    /**
     * Post text
     */

    if (item.post) {
      const post = this.add.text(0, 0, item.post, {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      });

      post.setAlpha(0.75);
      post.adaptive = () => {
        const fontSize = wrapper.width / 280;
        const offsetX = 5;

        post.setFontSize(`${fontSize}rem`);
        post.setX(text.x + text.width + offsetX);
      };

      wrapper.add(post);
    }

    return text;
  };

  return {
    update: () => {
      if (!container.visible) {
        return;
      }

      let items = data();

      if (!items) {
        return;
      }

      const newValue = items.map((item) => item.text).join('\n');

      if (value.current === newValue) {
        return;
      }

      value.current = newValue;
      container.removeAll(true);

      if (items.length === 0) {
        return;
      }

      items = items.sort((a, b) => (b.type || 'param').localeCompare((a.type || 'param')));
      items.forEach(create);

      const lastWrapper = <Phaser.GameObjects.Container> container.getAt(items.length - 1);

      // eslint-disable-next-line no-param-reassign
      container.width = 188; // TODO
      container.refreshAdaptive();
      // eslint-disable-next-line no-param-reassign
      container.height = refreshWrapper(lastWrapper);
    },
  };
});
