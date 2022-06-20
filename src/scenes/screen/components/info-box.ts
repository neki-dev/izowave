import Component from '~lib/ui';
import { toEven } from '~lib/utils';
import Player from '~scene/world/entities/player';
import ComponentCost from '~scene/screen/components/cost';

import { BuildingInstance } from '~type/building';

import {
  INTERFACE_TEXT_COLOR_ACTIVE, INTERFACE_BOX_COLOR_PURPLE,
  INTERFACE_FONT_PIXEL,
} from '~const/interface';

type Props = {
  params: () => BuildingInstance
  player: Player
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 14;

export default Component(function ComponentBuildingInfo(container, {
  params, player,
}: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, 0, INTERFACE_BOX_COLOR_PURPLE, 0.9);
  body.setOrigin(0, 0);

  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const labelText = this.add.text(shift.x, shift.y, '', {
    fontSize: '18px',
    fontFamily: INTERFACE_FONT_PIXEL,
    color: INTERFACE_TEXT_COLOR_ACTIVE,
  });
  shift.y += toEven(labelText.height + CONTAINER_PADDING * 0.6);

  const descriptionText = this.add.text(shift.x, shift.y, '\n\n', {
    fontSize: '10px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 1 },
    // @ts-ignore
    lineSpacing: 5,
  });
  shift.y += descriptionText.height + CONTAINER_PADDING;

  body.height = shift.y;
  shift.x += body.width - CONTAINER_PADDING;

  const cost = ComponentCost.call(this, {
    x: shift.x,
    y: 0,
  }, {
    label: 'BUILD',
    size: [60, shift.y],
    need: () => params()?.Cost,
    have: () => player.resources,
  });

  container.add([body, labelText, descriptionText, cost]);
  container.setSize(shift.x + cost.width, shift.y);

  return {
    update: () => {
      if (!container.visible) {
        return;
      }

      const values = params();
      if (values) {
        labelText.setText(values.Name);
        descriptionText.setText([
          values.Description,
          `HP: ${values.Health}`,
        ]);
      }
    },
  };
});
