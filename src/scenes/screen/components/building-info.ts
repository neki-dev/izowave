import { INTERFACE_BOX_COLOR, INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Player } from '~entity/player';
import { Component } from '~lib/ui';
import { ComponentCost } from '~scene/screen/components/cost';
import { ComponentParams } from '~scene/screen/components/params';
import { BuildingInstance } from '~type/world/entities/building';

type Props = {
  mode?: 'building' | 'builder'
  player: Player
  data: () => BuildingInstance
  resize?: (container: Phaser.GameObjects.Container) => void
};

export const ComponentBuildingInfo = Component<Props>(function (container, {
  player, data, resize, mode = 'building',
}) {
  const lines = {
    current: 0,
  };

  /**
   * Body
   */
  const body = this.add.rectangle(0, 0, 0, 0, INTERFACE_BOX_COLOR.BLUE, 0.9);

  body.setOrigin(0.0, 0.0);
  body.adaptive = () => {
    body.width = 220;
  };

  container.add(body);

  /**
   * Name
   */

  const name = this.add.text(0, 0, '', {
    resolution: window.devicePixelRatio,
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

  name.adaptive = () => {
    const fontSize = body.width / 190;
    const shadow = fontSize * 3;
    const offset = body.width * 0.07;

    name.setFontSize(`${fontSize}rem`);
    name.setShadowOffset(shadow, shadow);
    name.setPosition(offset, offset);
  };

  container.add(name);

  /**
   * Params
   */

  const params = ComponentParams.call(this, {
    data: () => data()?.Description,
  });

  params.adaptive = () => {
    const offsetX = body.width * 0.07;
    const offsetY = body.width * 0.05;

    params.width = 188;
    params.setPosition(
      offsetX,
      name.y + name.height + offsetY,
    );
  };

  container.add(params);

  /**
   * Cost
   */

  const cost = ComponentCost.call(this, {
    label: (mode === 'building') ? 'UPGRADE' : 'BUILD',
    need: () => data()?.Cost,
    have: () => player.resources,
  });

  cost.setVisible(false);
  cost.adaptive = () => {
    cost.setPosition(body.width, 0);
    cost.setSize(60, body.height);
  };

  container.add(cost);

  /**
   * Pointer
   */

  let pointer: Phaser.GameObjects.Triangle;

  if (mode === 'building') {
    pointer = this.add.triangle(0, 0, -10, 0, 10, 0, 0, 10, body.fillColor, body.fillAlpha);
    pointer.setOrigin(0.0, 0.0);
    container.add(pointer);
  }

  /**
   * Updating
   */

  const refreshSize = () => {
    const padding = 16;
    const width = body.width + (cost.visible ? cost.width : 0);
    const height = Math.max(params.y + params.height + padding, 77);

    body.height = height;
    cost.height = height;

    container.setSize(width, height);
    if (pointer) {
      pointer.setPosition(width / 2, height);
    }

    if (resize) {
      resize(container);
    }
  };

  refreshSize();

  return {
    update: () => {
      const values = data();

      if (values?.Name) {
        name.setText(values.Name);
      }

      if (values?.Description) {
        const newLines = values?.Description.map((item) => item.text.split('\n')).flat();

        if (lines.current !== newLines.length) {
          lines.current = newLines.length;
          refreshSize();
        }
      }

      if (values?.Cost) {
        if (!cost.visible) {
          cost.setVisible(true);
          refreshSize();
        }
      } else if (cost.visible) {
        cost.setVisible(false);
        refreshSize();
      }
    },
  };
});
