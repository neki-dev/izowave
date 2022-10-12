import { INTERFACE_FONT_MONOSPACE, INTERFACE_TEXT_COLOR_BLUE_DARK } from '~const/interface';
import { Component } from '~lib/ui';
import { BuildingDescriptionItem } from '~type/building';
import { ScreenTexture } from '~type/interface';

type Props = {
  data: () => BuildingDescriptionItem[]
};

export const ComponentParams = Component<Props>(function (container, {
  data,
}) {
  const current = {
    text: null,
  };

  const create = (item: BuildingDescriptionItem, offset: number) => {
    if (item.icon !== undefined) {
      const icon = this.add.image(0, offset, ScreenTexture.ICON, item.icon);
      icon.setOrigin(0.0, 0.0);
      container.add(icon);
    }

    const text = this.add.text((item.icon !== undefined) ? 15 : 0, offset - 1, item.text, (item.type === 'hint') ? {
      color: '#fff',
      fontSize: '10px',
      fontFamily: INTERFACE_FONT_MONOSPACE,
      backgroundColor: INTERFACE_TEXT_COLOR_BLUE_DARK,
      padding: { top: 1, left: 2, right: 2 },
    } : {
      color: item.color || '#fff',
      fontSize: '12px',
      fontFamily: INTERFACE_FONT_MONOSPACE,
      padding: { bottom: 1 },
    });
    text.setOrigin(0.0, 0.0);
    if (item.type === 'hint') {
      text.setAlpha(0.75);
    }
    container.add(text);

    if (item.post) {
      const post = this.add.text(text.x + text.width + 5, offset - 1, item.post, {
        fontSize: '10px',
        fontFamily: INTERFACE_FONT_MONOSPACE,
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
      if (current.text === newValue) {
        return;
      }

      current.text = newValue;

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
