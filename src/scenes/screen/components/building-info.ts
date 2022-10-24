import { INTERFACE_BOX_COLOR, INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Player } from '~entity/player';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { ComponentCost } from '~scene/screen/components/cost';
import { ComponentParams } from '~scene/screen/components/params';
import { BuildingInstance } from '~type/world/entities/building';

type Props = {
  mode?: 'building' | 'builder'
  player: Player
  data: () => BuildingInstance
  resize?: (container: Phaser.GameObjects.Container) => void
};

// TODO: Fix adaptation
export const ComponentBuildingInfo = Component<Props>(function (container, {
  player, data, resize, mode = 'building',
}) {
  const lines = {
    current: 0,
  };

  /**
   * Sidedata
   */
  const sidedata = this.add.container();

  useAdaptation(sidedata, () => {
    sidedata.width = 220;
  });

  container.add(sidedata);

  /**
   * Body
   */
  const body = this.add.rectangle(0, 0, 0, 0, INTERFACE_BOX_COLOR.BLUE, 0.9);

  body.setOrigin(0.0, 0.0);
  useAdaptation(body, () => {
    body.width = sidedata.width;
  });

  sidedata.add(body);

  /**
   * Name
   */

  const name = this.add.text(0, 0, '', {
    resolution: window.devicePixelRatio,
    fontFamily: INTERFACE_FONT.PIXEL,
    color: INTERFACE_TEXT_COLOR.PRIMARY,
    shadow: {
      color: '#332717',
      fill: true,
    },
  });

  useAdaptation(name, () => {
    const offset = body.width * 0.07;

    scaleText(name, {
      by: body.width,
      scale: 0.085,
      shadow: true,
    });
    name.setPosition(offset, offset);
  });

  sidedata.add(name);

  /**
   * Params
   */

  const params = ComponentParams.call(this, {
    data: () => data()?.Description,
  });

  useAdaptation(params, () => {
    const offsetX = body.width * 0.07;
    const offsetY = body.width * 0.035;

    params.setPosition(
      offsetX,
      name.y + name.height + offsetY,
    );
  });

  sidedata.add(params);

  /**
   * Cost
   */

  const cost = ComponentCost.call(this, {
    label: (mode === 'building') ? 'UPGRADE' : 'BUILD',
    need: () => data()?.Cost,
    have: () => player.resources,
  });

  cost.setVisible(false);
  useAdaptation(cost, () => {
    cost.setPosition(body.width, 0);
    cost.setSize(60, body.height); // ?
  });

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
    const paddingBottom = body.width * 0.07;
    const width = body.width + (cost.visible ? cost.width : 0);
    const height = params.y + params.height + paddingBottom;

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

  return {
    update: () => {
      const values = data();
      let needRefresh = false;

      if (values?.Name) {
        name.setText(values.Name);
      }

      if (values?.Description && lines.current !== values.Description.length) {
        lines.current = values.Description.length;
        needRefresh = true;
      }

      if (values?.Cost) {
        if (!cost.visible) {
          cost.setVisible(true);
          needRefresh = true;
        }
      } else if (cost.visible) {
        cost.setVisible(false);
        needRefresh = true;
      }

      if (needRefresh) {
        refreshSize();
      }
    },
  };
});
