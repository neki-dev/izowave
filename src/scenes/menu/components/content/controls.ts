import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Component } from '~lib/ui';

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

    wrapper.adaptive = () => {
      wrapper.setPosition(0, (container.height * 0.12) * index);
    };

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

    name.adaptive = () => {
      const fontSize = container.width / 500;

      name.setFontSize(`${fontSize}rem`);
    };

    wrapper.add(name);

    /**
     * Description
     */

    const description = this.add.text(0, 0, `  -  ${item.description}`, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
    });

    description.setOrigin(0.0, 0.5);
    description.adaptive = () => {
      const fontSize = container.width / 600;

      description.setFontSize(`${fontSize}rem`);
      description.setPosition(name.width, name.height * 0.5);
    };

    wrapper.add(description);
  });
});
