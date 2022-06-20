import Component from '~lib/ui';
import { toEven } from '~lib/utils';
import Player from '~scene/world/entities/player';
import World from '~scene/world';
import Building from '~scene/world/entities/building';
import ComponentCost from '~scene/screen/components/cost';

import {
  INTERFACE_TEXT_COLOR_ACTIVE, INTERFACE_BOX_COLOR_PURPLE, INTERFACE_FONT_PIXEL,
} from '~const/interface';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { TILE_META } from '~const/level';

type Props = {
  building: Building
  player: Player
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 14;

export default Component(function ComponentBuildingInfo(this: World, container, {
  building, player,
}: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, 0, INTERFACE_BOX_COLOR_PURPLE, 0.9);
  body.setOrigin(0, 0);

  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const name = this.add.text(shift.x, shift.y, building.getName(), {
    fontSize: '18px',
    fontFamily: INTERFACE_FONT_PIXEL,
    color: INTERFACE_TEXT_COLOR_ACTIVE,
  });
  shift.y += toEven(name.height + CONTAINER_PADDING * 0.6);

  const upgrade = this.add.text(shift.x, shift.y, '', {
    fontSize: '10px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 1 },
  });
  shift.y += toEven(upgrade.height + CONTAINER_PADDING * 0.6);

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
    need: () => building.getUpgradeLevelCost(),
    have: () => player.resources,
  });
  cost.setVisible(false);

  container.add([body, name, upgrade, description, cost]);
  container.setDepth(9999);

  const refresh = () => {
    container.setSize(shift.x, shift.y);
    container.setPosition(
      building.x - container.width / 2,
      toEven(building.y - container.height - TILE_META.halfHeight),
    );
  };

  refresh();

  return {
    update: () => {
      upgrade.setText(`UPGRADE ${building.upgradeLevel} OF ${BUILDING_MAX_UPGRADE_LEVEL}`);
      description.setText(building.getInfo());

      const isCanUpgrade = (building.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.wave.isGoing);
      if (isCanUpgrade) {
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
