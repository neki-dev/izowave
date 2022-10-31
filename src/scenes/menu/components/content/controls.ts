import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import {
  useAdaptation, Component, scaleText, useAdaptationAfter, switchSize,
} from '~lib/ui';
import { ControlItem } from '~type/menu';

type Props = {
  controlItems: ControlItem[]
};

export const ComponentControls = Component<Props>(function (container, {
  controlItems,
}) {
  const ref: Record<string, {
    wrapper?: Phaser.GameObjects.Container
    name?: Phaser.GameObjects.Text
    description?: Phaser.GameObjects.Text
  }> = {};

  /**
   * Creating
   */

  controlItems.forEach(({ name, description }, index) => {
    ref[name] = {};

    /**
     * Wrapper
     */

    container.add(
      ref[name].wrapper = this.add.container(),
    );

    useAdaptationAfter(ref[name].wrapper, () => {
      ref[name].wrapper.setPosition(
        0,
        (ref[name].name.height + switchSize(10)) * index,
      );
    });

    /**
     * Name
     */

    ref[name].wrapper.add(
      ref[name].name = this.add.text(0, 0, name, {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.PIXEL,
        backgroundColor: INTERFACE_TEXT_COLOR.BLUE_DARK,
        padding: {
          top: 4,
          bottom: 6,
          left: 5,
          right: 5,
        },
      }),
    );

    useAdaptation(ref[name].name, () => {
      scaleText(ref[name].name, 15);
    });

    /**
     * Description
     */

    ref[name].wrapper.add(
      ref[name].description = this.add.text(0, 0, `  -  ${description}`, {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.PIXEL,
      }),
    );

    ref[name].description.setOrigin(0.0, 0.5);
    useAdaptation(ref[name].description, () => {
      ref[name].description.setPosition(
        ref[name].name.width,
        ref[name].name.height / 2,
      );
      scaleText(ref[name].description, 11);
    });
  });
});
