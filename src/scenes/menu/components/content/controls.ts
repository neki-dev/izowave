import { INTERFACE_BOX_COLOR_BLUE, INTERFACE_FONT_PIXEL } from '~const/interface';
import { Component } from '~lib/ui';

export const ComponentControls = Component(function (container) {
  let shift = 0;

  for (const item of [
    { name: 'W A S D', description: 'Move player' },
    { name: 'SPACE', description: 'Attack' },
    {},
    { name: 'CLICK', description: 'New build' },
    { name: 'U', description: 'Upgrade building' },
    { name: 'R', description: 'Reload tower ammo' },
    { name: 'BACKSPACE', description: 'Destroy building' },
    {},
    { name: 'N', description: 'Skip wave timeleft' },
    { name: 'ESC', description: 'Pause game' },
  ]) {
    if (item.name) {
      const containerKey = this.add.container(0, shift);

      const textName = this.add.text(0, 0, item.name, {
        fontSize: '16px',
        fontFamily: INTERFACE_FONT_PIXEL,
        padding: {
          top: 3,
          bottom: 7,
          left: 5,
          right: 5,
        },
      });

      const body = this.add.rectangle(0, 0, textName.width, textName.height, INTERFACE_BOX_COLOR_BLUE);

      body.setOrigin(0.0, 0.0);

      const description = this.add.text(body.width + 10, 6, `-  ${item.description}`, {
        fontSize: '13px',
        fontFamily: INTERFACE_FONT_PIXEL,
      });

      containerKey.add([body, textName, description]);
      containerKey.setSize(body.width + 10 + description.width, body.height);
      container.add(containerKey);
      shift += containerKey.height + 15;
    } else {
      shift += 15;
    }
  }
});
