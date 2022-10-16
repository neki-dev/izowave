import { INTERFACE_BOX_COLOR, INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { WORLD_DEPTH_UI } from '~const/world';
import { Component } from '~lib/ui';
import { toEven } from '~lib/utils';
import { ComponentCost } from '~scene/screen/components/cost';
import { ComponentParams } from '~scene/screen/components/params';
import { Player } from '~scene/world/entities/player';
import { BuildingInstance } from '~type/world/entities/building';

type Props = {
  mode?: 'building' | 'builder'
  origin: [number, number]
  player: Player
  data: () => BuildingInstance
};

const CONTAINER_WIDTH = 220;
const CONTAINER_MIN_HEIGHT = 77;
const CONTAINER_PADDING = 16;

export const ComponentBuildingInfo = Component<Props>(function (container, {
  origin, player, data, mode = 'building',
}) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_MIN_HEIGHT, INTERFACE_BOX_COLOR.BLUE, 0.9);

  body.setOrigin(0.0, 0.0);

  let position = { x: container.x, y: container.y };
  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const name = this.add.text(shift.x, shift.y, '', {
    fontSize: '18px',
    fontFamily: INTERFACE_FONT.PIXEL,
    color: INTERFACE_TEXT_COLOR.PRIMARY,
    padding: { bottom: 2 },
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: '#332717',
      blur: 0,
      fill: true,
    },
  });

  shift.y += toEven(name.height + CONTAINER_PADDING);

  const description = ComponentParams.call(this, shift, {
    data: () => data()?.Description,
  });

  const cost = ComponentCost.call(this, {
    x: body.width,
    y: 0,
  }, {
    label: (mode === 'building') ? 'UPGRADE' : 'BUILD',
    size: [60, CONTAINER_MIN_HEIGHT],
    need: () => data()?.Cost,
    have: () => player.resources,
  });

  cost.setVisible(false);

  let point: Phaser.GameObjects.Triangle;

  if (mode === 'building') {
    point = this.add.triangle(0, 0, -10, 0, 10, 0, 0, 10, body.fillColor, body.fillAlpha);
    point.setOrigin(0.0, 0.0);
  }

  container.setDepth(WORLD_DEPTH_UI);
  container.add([body, name, description, cost]);
  if (point) {
    container.add(point);
  }

  const refresh = () => {
    const width = body.width + (cost.visible ? cost.width : 0);
    const height = Math.max(description.y + description.height + CONTAINER_PADDING, CONTAINER_MIN_HEIGHT);

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

  let prevLines = 0;

  return {
    update: () => {
      const values = data();

      if (values?.Name) {
        name.setText(values.Name);
      }

      if (values?.Description) {
        const lines = values?.Description.map((item) => item.text.split('\n')).flat();

        if (prevLines !== lines.length) {
          prevLines = lines.length;
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
