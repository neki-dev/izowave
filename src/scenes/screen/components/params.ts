import { INTERFACE_FONT } from '~const/interface';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { ScreenTexture } from '~type/screen';
import { BuildingDescriptionItem } from '~type/world/entities/building';

type Props = {
  data: () => BuildingDescriptionItem[]
};

// TODO: Fix adaptation
export const ComponentParams = Component<Props>(function (container, {
  data,
}) {
  const value: {
    current: string
  } = { current: null };

  useAdaptation(container, () => {
    // eslint-disable-next-line no-param-reassign
    container.width = 190;
  }, () => {
    const wrappers = <Phaser.GameObjects.Container[]> container.getAll();
    const lastWrapper = wrappers[wrappers.length - 1];

    if (lastWrapper) {
      // eslint-disable-next-line no-param-reassign
      container.height = lastWrapper.y + lastWrapper.height;
    }
  });

  const create = (item: BuildingDescriptionItem, index: number) => {
    /**
     * Wrapper
     */

    const wrapper = this.add.container();

    useAdaptation(wrapper, () => {
      let offset = 0;

      if (index > 0) {
        const prevWrapper = <Phaser.GameObjects.Container> container.getAt(index - 1);
        const prevOffset = prevWrapper.y + prevWrapper.height;
        const offsetY = container.width * 0.025;

        offset += prevOffset + offsetY;
      }

      wrapper.setPosition(0, offset);
      wrapper.width = container.width;
    }, () => {
      const text = <Phaser.GameObjects.Text> wrapper.getByName('Text');

      wrapper.height = text.height;
    });

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

    const text = this.add.text(0, 0, item.text, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
      color: item.color || '#fff',
    });

    text.setName('Text');
    useAdaptation(text, () => {
      const paddingBottom = (item.type === 'text') ? 8 : 0;

      text.setWordWrapWidth(wrapper.width);
      scaleText(text, {
        by: wrapper.width,
        scale: 0.07,
      });
      text.setPosition(
        icon ? (icon.width + 5) : 0,
        -2, // ?
      );
      text.setPadding(0, 0, 0, paddingBottom);
    });

    wrapper.add(text);

    /**
     * Post text
     */

    if (item.post) {
      const post = this.add.text(0, 0, ` → ${item.post}`, {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      });

      post.setAlpha(0.75);
      useAdaptation(post, () => {
        scaleText(post, {
          by: wrapper.width,
          scale: 0.06,
        });
        post.setPosition(
          text.x + text.width,
          0,
        );
      });

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

      const newValue = items.map((item) => (item.text + (item.post || ''))).join('\n');

      if (value.current === newValue) {
        return;
      }

      value.current = newValue;
      container.removeAll(true);

      if (items.length === 0) {
        return;
      }

      items = items.sort((a, b) => (b.type || 'param').localeCompare(a.type || 'param'));
      items.forEach(create);

      container.refreshAdaptive();
    },
  };
});
