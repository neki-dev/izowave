import Component from '~lib/ui';
import { toEven } from '~lib/utils';
import Player from '~scene/world/entities/player';
import ComponentCost from '~scene/screen/components/cost';

import { BuildingInstance } from '~type/building';

import { WORLD_DEPTH_UI } from '~const/world';
import {
  INTERFACE_TEXT_COLOR_ACTIVE, INTERFACE_BOX_COLOR_PURPLE, INTERFACE_FONT_PIXEL, INTERFACE_FONT_MONOSPACE,
} from '~const/interface';
import { ScreenTexture } from '~type/interface';

type Props = {
  mode?: 'building' | 'builder'
  origin: [number, number]
  player: Player
  data: () => BuildingInstance
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 16;

export default Component(function ComponentBuildingInfo(container, {
  origin, player, data, mode = 'building',
}: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, 77, INTERFACE_BOX_COLOR_PURPLE, 0.9);
  body.setOrigin(0.0, 0.0);

  let position = { x: container.x, y: container.y };
  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const name = this.add.text(shift.x, shift.y, '', {
    fontSize: '18px',
    fontFamily: INTERFACE_FONT_PIXEL,
    color: INTERFACE_TEXT_COLOR_ACTIVE,
  });
  shift.y += toEven(name.height + CONTAINER_PADDING);

  const description = this.add.container(shift.x, shift.y);
  // shift.y += CONTAINER_PADDING;

  // body.height = shift.y;

  const cost = ComponentCost.call(this, {
    x: body.width,
    y: 0,
  }, {
    label: (mode === 'building') ? 'UPGRADE' : 'BUILD',
    size: [60, 77],
    need: () => data()?.Cost,
    have: () => player.resources,
  });
  cost.setVisible(false);

  let point: Phaser.GameObjects.Triangle;
  if (mode === 'building') {
    point = this.add.triangle(0, 0, -10, 0, 10, 0, 0, 10, INTERFACE_BOX_COLOR_PURPLE, 0.9);
    point.setOrigin(0.0, 0.0);
  }

  container.setDepth(WORLD_DEPTH_UI);
  container.add([body, name, description, cost]);
  if (point) {
    container.add(point);
  }

  const refresh = () => {
    const width = body.width + (cost.visible ? cost.width : 0);
    const height = Math.max(description.y + description.height + CONTAINER_PADDING, 77);
    body.height = height;
    cost.height = height;

    container.setSize(width, height);
    container.setPosition(
      toEven(position.x - (container.width * origin[0])),
      toEven(position.y - (container.height * origin[1])),
    );

    if (point) {
      point.setPosition(width / 2, height);
    }
  };

  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  container.setPositionWithOrigin = (x: number, y: number) => {
    position = { x, y };
    refresh();
  };

  refresh();

  const current = {
    text: null,
  };

  return {
    update: () => {
      const values = data();
      if (values) {
        name.setText(values.Name);
        const newDescription = values.Description.map((item) => item.text).join('\n');
        if (current.text !== newDescription) {
          current.text = newDescription;
          description.removeAll(true);
          let offset = 0;
          const items = values.Description.sort((a, b) => (b.type || 'param').localeCompare((a.type || 'param')));
          items.forEach((item, index) => {
            if (item.type === 'hint') {
              offset += 6;
            }
            if (item.icon !== undefined) {
              const icon = this.add.image(0, offset, ScreenTexture.ICON, item.icon);
              icon.setOrigin(0.0, 0.0);
              description.add(icon);
            }
            const text = this.add.text((item.icon !== undefined) ? 15 : 0, offset - 1, item.text, {
              color: (item.type === 'hint') ? '#ffd800' : '#fff',
              fontSize: (item.type === 'hint') ? '10px' : '12px',
              fontFamily: INTERFACE_FONT_MONOSPACE,
              padding: { bottom: 1 },
            });
            text.setOrigin(0.0, 0.0);
            text.setAlpha(0.9);
            description.add(text);
            if (item.post) {
              const post = this.add.text(text.x + text.width + 5, offset, item.post, {
                fontSize: '9px',
                fontFamily: INTERFACE_FONT_MONOSPACE,
                padding: { bottom: 1 },
              });
              post.setOrigin(0.0, 0.0);
              post.setAlpha(0.5);
              description.add(post);
            }
            offset += text.height;
            if (index + 1 !== items.length) {
              offset += (item.type === 'text') ? 8 : 2;
            }
          });
          description.setSize(100, offset);
          refresh();
        }
      }

      if (values?.Cost) {
        if (!cost.visible) {
          cost.setVisible(true);
          refresh();
        }
      } else if (cost.visible) {
        cost.setVisible(false);
        refresh();
      }
    },
  };
});
