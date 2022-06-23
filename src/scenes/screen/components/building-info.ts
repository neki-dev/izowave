import Component from '~lib/ui';
import { toEven } from '~lib/utils';
import Player from '~scene/world/entities/player';
import ComponentCost from '~scene/screen/components/cost';

import { BuildingInstance } from '~type/building';

import {
  INTERFACE_TEXT_COLOR_ACTIVE, INTERFACE_BOX_COLOR_PURPLE, INTERFACE_FONT_PIXEL,
} from '~const/interface';
import { WORLD_DEPTH_UI } from '~const/world';

type Props = {
  mode?: 'building' | 'builder'
  origin: [number, number]
  player: Player
  data: () => BuildingInstance & {
    Label?: string
  }
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 14;

export default Component(function ComponentBuildingInfo(container, {
  origin, player, data, mode = 'building',
}: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, 0, INTERFACE_BOX_COLOR_PURPLE, 0.9);
  body.setOrigin(0.0, 0.0);

  let position = { x: container.x, y: container.y };
  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const name = this.add.text(shift.x, shift.y, '', {
    fontSize: '18px',
    fontFamily: INTERFACE_FONT_PIXEL,
    color: INTERFACE_TEXT_COLOR_ACTIVE,
  });
  shift.y += toEven(name.height + CONTAINER_PADDING * 0.6);

  let label: Phaser.GameObjects.Text;
  if (data()?.Label) {
    label = this.add.text(shift.x, shift.y, '', {
      fontSize: '10px',
      fontFamily: INTERFACE_FONT_PIXEL,
      padding: { bottom: 1 },
    });
    label.setAlpha(0.75);
    shift.y += toEven(label.height + CONTAINER_PADDING * 0.6);
  }

  const description = this.add.text(shift.x, shift.y, '', {
    fontSize: '10px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 1 },
    // @ts-ignore
    lineSpacing: 5,
  });
  shift.y += description.height + CONTAINER_PADDING;

  body.height = shift.y;

  const cost = ComponentCost.call(this, {
    x: body.width,
    y: 0,
  }, {
    label: (mode === 'building') ? 'UPGRADE' : 'BUILD',
    size: [60, body.height],
    need: () => data()?.Cost,
    have: () => player.resources,
  });
  cost.setVisible(false);

  container.add([body, name, description, cost]);
  container.setDepth(WORLD_DEPTH_UI);

  if (label) {
    container.add(label);
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
  };

  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  container.setPositionWithOrigin = (x: number, y: number) => {
    position = { x, y };
    refresh();
  };

  refresh();

  return {
    update: () => {
      const values = data();
      if (values) {
        name.setText(values.Name);
        if (label) {
          label.setText(values.Label);
        }
        const newDescription = Array.isArray(values.Description) ? values.Description.join('\n') : values.Description;
        if (description.text !== newDescription) {
          description.setText(newDescription);
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
