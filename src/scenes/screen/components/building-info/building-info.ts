import { INTERFACE_BOX_COLOR, INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import {
  useAdaptation, Component, scaleText, switchSize, useAdaptationAfter, refreshAdaptive,
} from '~lib/ui';
import { ComponentActions } from '~scene/screen/components/building-info/actions';
import { ComponentParams } from '~scene/screen/components/building-info/params';
import { ComponentUpgradeLevel } from '~scene/screen/components/building-info/upgrade-level';
import { BuildingParamItem } from '~type/world/entities/building';

type Props = {
  name: string
  upgradeLevel: () => number
  params: () => BuildingParamItem[]
  actions: () => Array<{
    label: string
    onClick: () => void
  }>
};

export const ComponentBuildingInfo = Component<Props>(function (container, {
  name, upgradeLevel, params, actions,
}) {
  const ref: {
    body?: Phaser.GameObjects.Rectangle
    name?: Phaser.GameObjects.Text
    upgradeLevel?: Phaser.GameObjects.Container
    params?: Phaser.GameObjects.Container
    pointer?: Phaser.GameObjects.Triangle
    actions?: Phaser.GameObjects.Container
  } = {};

  const state: {
    lines: number
  } = { lines: null };

  /**
   * Adaptation
   */

  useAdaptation(container, () => {
    // eslint-disable-next-line no-param-reassign
    container.width = switchSize(220);
  });

  useAdaptationAfter(container, () => {
    // eslint-disable-next-line no-param-reassign
    container.height = ref.params.y + ref.params.height + switchSize(12);

    refreshAdaptive(ref.actions);
    refreshAdaptive(ref.pointer);
  });

  /**
   * Creating
   */

  /**
   * Body
   */

  container.add(
    ref.body = this.add.rectangle(0, 0, 0, 0, INTERFACE_BOX_COLOR.BLUE, 0.8),
  );

  ref.body.setOrigin(0.0, 0.0);
  useAdaptation(ref.body, () => {
    ref.body.setSize(container.width, container.height);
  });

  /**
   * Name
   */

  container.add(
    ref.name = this.add.text(0, 0, name, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      color: INTERFACE_TEXT_COLOR.PRIMARY,
      shadow: {
        color: '#332717',
        fill: true,
      },
    }),
  );

  useAdaptation(ref.name, () => {
    scaleText(ref.name, 18, true);
    ref.name.setPosition(
      switchSize(12),
      switchSize(12),
    );
  });

  /**
   * Upgrade level
   */

  container.add(
    ref.upgradeLevel = ComponentUpgradeLevel.call(this, {
      value: upgradeLevel,
    }),
  );

  useAdaptation(ref.upgradeLevel, () => {
    ref.upgradeLevel.setPosition(
      switchSize(12),
      ref.name.y + ref.name.height + switchSize(6),
    );
  });

  /**
   * Params
   */

  container.add(
    ref.params = ComponentParams.call(this, {
      items: params,
    }),
  );

  useAdaptation(ref.params, () => {
    ref.params.setPosition(
      switchSize(12),
      ref.upgradeLevel.y + ref.upgradeLevel.height + switchSize(12),
    );
  });

  /**
   * Pointer
   */

  const size = switchSize(10);

  ref.pointer = this.add.triangle(0, 0, -size, 0, size, 0, 0, size, ref.body.fillColor, ref.body.fillAlpha);
  container.add(ref.pointer);

  ref.pointer.setOrigin(0.0, 0.0);
  useAdaptation(ref.pointer, () => {
    ref.pointer.setPosition(
      container.width / 2,
      container.height,
    );
  });

  /**
   * Actions
   */

  container.add(
    ref.actions = ComponentActions.call(this, {
      actions,
    }),
  );

  useAdaptation(ref.actions, () => {
    ref.actions.setPosition(
      (container.width / 2) - (ref.actions.width / 2),
      container.height + switchSize(60),
    );
  });

  /**
   * Updating
   */

  return {
    update: () => {
      const currentParams = params();

      if (state.lines !== currentParams.length) {
        state.lines = currentParams.length;

        refreshAdaptive(container, false);
        refreshAdaptive(ref.body);
      }
    },
  };
});
