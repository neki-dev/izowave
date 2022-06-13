import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';

import { WORLD_DIFFICULTY_KEY, WORLD_DIFFICULTY_POWERS } from '~const/world';
import { INTERFACE_ACTIVE_COLOR } from '~const/interface';

type Props = {
  disabled: boolean
};

const Component: UIComponent<Props> = function ComponentDifficulty(
  this: Phaser.Scene,
  { disabled },
) {
  const container = this.add.container(0, 0);
  let shift = 0;

  const difficulty = {
    current: localStorage.getItem(WORLD_DIFFICULTY_KEY),
  };
  for (const type of Object.keys(WORLD_DIFFICULTY_POWERS)) {
    const text = new Text(this, {
      position: { x: 0, y: shift },
      value: type,
      origin: [0, 0],
      alpha: disabled ? 0.5 : 1.0,
      color: (difficulty.current === type) ? INTERFACE_ACTIVE_COLOR : '#ffffff',
      fontSize: 18,
    });
    if (!disabled) {
      text.setInteractive();
      text.on(Phaser.Input.Events.POINTER_OVER, () => {
        this.input.setDefaultCursor('pointer');
        text.setColor(INTERFACE_ACTIVE_COLOR);
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
        text.setColor(INTERFACE_ACTIVE_COLOR);
      });
    }
    container.add(text);
    shift += text.height + 20;
  }

  return container
    .setName('ComponentDifficulty');
};

export default Component;
