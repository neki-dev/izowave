import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { useAdaptation, Component, scaleText } from '~lib/ui';

export const ComponentControls = Component(function (container) {
  [
    { name: 'W A S D', description: 'Move player' },
    { name: 'CLICK', description: 'New build' },
    { name: 'U', description: 'Upgrade building' },
    { name: 'R', description: 'Reload tower ammo' },
    { name: 'BACKSPACE', description: 'Destroy building' },
    { name: 'N', description: 'Skip wave timeleft' },
    { name: 'ESC', description: 'Pause game' },
  ].forEach((item, index) => {
    /**
     * Wrapper
     */

    const wrapper = this.add.container();

    useAdaptation(wrapper, () => {
      wrapper.setPosition(0, (container.height * 0.12) * index);
    });

    container.add(wrapper);

    /**
     * Name
     */

    const name = this.add.text(0, 0, item.name, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      backgroundColor: INTERFACE_TEXT_COLOR.BLUE_DARK,
      padding: {
        top: 4,
        bottom: 6,
        left: 5,
        right: 5,
      },
    });

    useAdaptation(name, () => {
      scaleText(name, {
        by: container.width,
        scale: 0.035,
      });
    });

    wrapper.add(name);

    /**
     * Description
     */

    const description = this.add.text(0, 0, `  -  ${item.description}`, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
    });

    description.setOrigin(0.0, 0.5);
    useAdaptation(description, () => {
      description.setPosition(name.width, name.height * 0.5);
      scaleText(description, {
        by: container.width,
        scale: 0.025,
      });
    });

    wrapper.add(description);
  });
});
