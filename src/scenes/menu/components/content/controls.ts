import { CONTROLS } from '~const/controls';
import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';

export const ComponentControls = Component(function (container) {
  const ref: Record<string, {
    wrapper?: Phaser.GameObjects.Container
    name?: Phaser.GameObjects.Text
    description?: Phaser.GameObjects.Text
  }> = {};

  /**
   * Creating
   */

  CONTROLS.forEach(({ name, description }, index) => {
    ref[name] = {};

    /**
     * Wrapper
     */

    container.add(
      ref[name].wrapper = this.add.container(),
    );

    ref[name].wrapper.useAdaptationAfter(() => {
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

    ref[name].name.useAdaptationBefore(() => {
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
    ref[name].description.useAdaptationBefore(() => {
      ref[name].description.setPosition(
        ref[name].name.width,
        ref[name].name.height / 2,
      );
      scaleText(ref[name].description, 11);
    });
  });
});
