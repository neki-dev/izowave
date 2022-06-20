import Component from '~lib/ui';

import { INTERFACE_TEXT_COLOR_ACTIVE, INTERFACE_FONT_PIXEL } from '~const/interface';
import { WORLD_DIFFICULTY_KEY, WORLD_DIFFICULTY_POWERS } from '~const/world';

type Props = {
  disabled: boolean
};

export default Component(function ComponentDifficulty(container, { disabled }: Props) {
  const difficulty = {
    current: localStorage.getItem(WORLD_DIFFICULTY_KEY),
  };

  let shift = 0;
  for (const type of Object.keys(WORLD_DIFFICULTY_POWERS)) {
    const text = this.add.text(0, shift, type, {
      color: (difficulty.current === type) ? INTERFACE_TEXT_COLOR_ACTIVE : '#ffffff',
      fontSize: '18px',
      fontFamily: INTERFACE_FONT_PIXEL,
    });
    text.setAlpha(disabled ? 0.5 : 1.0);

    if (!disabled) {
      text.setInteractive();
      text.on(Phaser.Input.Events.POINTER_OVER, () => {
        this.input.setDefaultCursor('pointer');
        text.setColor(INTERFACE_TEXT_COLOR_ACTIVE);
      });
      text.on(Phaser.Input.Events.POINTER_OUT, () => {
        this.input.setDefaultCursor('default');
        if (difficulty.current !== type) {
          text.setColor('#ffffff');
        }
      });
      text.on(Phaser.Input.Events.POINTER_UP, () => {
        difficulty.current = type;
        localStorage.setItem(WORLD_DIFFICULTY_KEY, type);
        container.each((child: Phaser.GameObjects.Text) => {
          child.setColor('#ffffff');
        });
        text.setColor(INTERFACE_TEXT_COLOR_ACTIVE);
      });
    }

    container.add(text);
    shift += text.height + 25;
  }

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});
