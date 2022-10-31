import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { INTERFACE_BOX_COLOR } from '~const/interface';
import { useAdaptation, Component, switchSize } from '~lib/ui';

type Props = {
  value: () => number
};

export const ComponentUpgradeLevel = Component<Props>(function (container, {
  value,
}) {
  const ref: Array<{
    wrapper?: Phaser.GameObjects.Container
    body?: Phaser.GameObjects.Rectangle
    progress?: Phaser.GameObjects.Rectangle
  }> = [];

  const state: {
    value: number
  } = { value: null };

  /**
   * Adaptation
   */

  useAdaptation(container, () => {
    container.setSize(
      switchSize(196),
      switchSize(8),
    );
  });

  /**
   * Creating
   */

  for (let i = 0; i < BUILDING_MAX_UPGRADE_LEVEL; i++) {
    ref[i] = {};

    /**
     * Wrapper
     */

    container.add(
      ref[i].wrapper = this.add.container(),
    );

    useAdaptation(ref[i].wrapper, () => {
      const offsetX = 2;
      const width = (container.width - ((BUILDING_MAX_UPGRADE_LEVEL - 1) * offsetX)) / BUILDING_MAX_UPGRADE_LEVEL;

      ref[i].wrapper.setSize(
        width,
        container.height,
      );
      ref[i].wrapper.setPosition(
        (width + offsetX) * i,
        0,
      );
    });

    /**
     * Body
     */

    ref[i].wrapper.add(
      ref[i].body = this.add.rectangle(0, 0, 0, 0, 0x000000),
    );

    ref[i].body.setOrigin(0.0, 0.0);
    useAdaptation(ref[i].body, () => {
      ref[i].body.setSize(
        ref[i].wrapper.width,
        ref[i].wrapper.height,
      );
    });

    /**
     * Progress
     */

    ref[i].wrapper.add(
      ref[i].progress = this.add.rectangle(1, 1, 0, 0, INTERFACE_BOX_COLOR.INFO),
    );

    ref[i].progress.setVisible(false);
    ref[i].progress.setOrigin(0.0, 0.0);
    useAdaptation(ref[i].progress, () => {
      ref[i].progress.setSize(
        ref[i].wrapper.width - 2,
        ref[i].wrapper.height - 2,
      );
    });
  }

  /**
   * Updating
   */

  return {
    update: () => {
      const currentValue = value();

      if (state.value !== currentValue) {
        for (let i = 0; i < BUILDING_MAX_UPGRADE_LEVEL; i++) {
          ref[i].progress.setVisible(currentValue >= i + 1);
        }

        state.value = currentValue;
      }
    },
  };
});
