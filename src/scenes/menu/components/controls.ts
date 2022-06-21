import Component from '~lib/ui';

import { INTERFACE_BOX_COLOR_PURPLE, INTERFACE_FONT_PIXEL } from '~const/interface';

export default Component(function ComponentControls(container) {
  let shift = 0;
  for (const item of [
    { name: 'W A S D', description: 'Move player' },
    { name: 'SPACE', description: 'Attack' },
    { name: 'LEFT CLICK', description: 'Build' },
    { name: 'DOUBLE CLICK', description: 'Upgrade building' },
    { name: 'BACKSPACE', description: 'Destroy building' },
    { name: 'N', description: 'Skip wave timeleft' },
    { name: 'ESC', description: 'Pause game' },
  ]) {
    const containerKey = this.add.container(0, shift);

    const textName = this.add.text(5, 5, item.name, {
      fontSize: '18px',
      fontFamily: INTERFACE_FONT_PIXEL,
    });

    const body = this.add.rectangle(0, 0, textName.width + 10, textName.height + 10, INTERFACE_BOX_COLOR_PURPLE);
    body.setOrigin(0.0, 0.0);

    const description = this.add.text(body.width + 10, 7, `-  ${item.description}`, {
      fontSize: '14px',
      fontFamily: INTERFACE_FONT_PIXEL,
    });

    containerKey.add([body, textName, description]);
    containerKey.setSize(body.width + 10 + description.width, body.height);
    container.add(containerKey);
    shift += containerKey.height + 15;
  }
});
