import Component from '~lib/ui';
import { toEven } from '~lib/utils';
import Player from '~scene/world/entities/player';
import World from '~scene/world';
import ComponentCost from '~scene/screen/components/cost';

import { BuildingInstance } from '~type/building';

import {
  INTERFACE_TEXT_COLOR_ACTIVE, INTERFACE_BOX_COLOR_PURPLE, INTERFACE_FONT_PIXEL,
} from '~const/interface';

type Props = {
  origin: [number, number]
  player: Player
  data: () => BuildingInstance & {
    Label?: string
  }
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 14;

export default Component(function ComponentBuildingInfo(this: World, container, {
  origin, player, data,
}: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, 0, INTERFACE_BOX_COLOR_PURPLE, 0.9);
  body.setOrigin(0, 0);

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
    shift.y += toEven(label.height + CONTAINER_PADDING * 0.6);
  }

  const description = this.add.text(shift.x, shift.y, '\n', {
    fontSize: '10px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 1 },
    // @ts-ignore
    lineSpacing: 5,
  });
  shift.y += description.height + CONTAINER_PADDING;

  body.height = shift.y;
  shift.x += body.width - CONTAINER_PADDING;

  const cost = ComponentCost.call(this, {
    x: shift.x,
    y: 0,
  }, {
    label: 'UPGRADE',
    size: [60, shift.y],
    need: () => data()?.Cost,
    have: () => player.resources,
  });
  cost.setVisible(false);

  container.add([body, name, description, cost]);
  container.setDepth(9999);

  if (label) {
    container.add(label);
  }

  const refresh = () => {
    container.setSize(shift.x, shift.y);
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
        description.setText(values.Description);
        if (label) {
          label.setText(values.Label);
        }
      }

      if (values?.Cost) {
        if (!cost.visible) {
          cost.setVisible(true);
          shift.x += cost.width;
          refresh();
        }
      } else if (cost.visible) {
        cost.setVisible(false);
        shift.x -= cost.width;
        refresh();
      }
    },
  };
});
