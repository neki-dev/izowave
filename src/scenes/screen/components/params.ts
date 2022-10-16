import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
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

  const create = (item: BuildingDescriptionItem, offset: number) => {
    if (item.icon !== undefined) {
      const icon = this.add.image(0, offset, ScreenTexture.ICON, item.icon);

      icon.setOrigin(0.0, 0.0);
      container.add(icon);
    }

    const text = this.add.text((item.icon !== undefined) ? 15 : 0, offset - 1, item.text, (item.type === 'hint') ? {
      color: INTERFACE_TEXT_COLOR.BLUE_LIGHT,
      fontSize: '10px',
      fontFamily: INTERFACE_FONT.MONOSPACE,
      backgroundColor: INTERFACE_TEXT_COLOR.BLUE_DARK,
      padding: { top: 2, left: 3, right: 3 },
    } : {
      color: item.color || '#fff',
      fontSize: '12px',
      fontFamily: INTERFACE_FONT.MONOSPACE,
      padding: { bottom: 1 },
    });

    text.setOrigin(0.0, 0.0);
    container.add(text);

    if (item.post) {
      const post = this.add.text(text.x + text.width + 5, offset - 1, item.post, {
        fontSize: '10px',
        fontFamily: INTERFACE_FONT.MONOSPACE,
        padding: { bottom: 1 },
      });

      post.setOrigin(0.0, 0.0);
      post.setAlpha(0.75);
      container.add(post);
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

      let offset = 0;

      items = items.sort((a, b) => (b.type || 'param').localeCompare((a.type || 'param')));
      items.forEach((item, index) => {
        if (item.type === 'hint') {
          offset += 6;
        }

        const text = create(item, offset);

        offset += text.height;
        if (index + 1 !== items.length) {
          offset += (item.type === 'text') ? 8 : 2;
        }
      });

      container.setSize(188, offset);
    },
  };
});
