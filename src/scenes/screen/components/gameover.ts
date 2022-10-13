import {
  INTERFACE_TEXT_COLOR_ERROR_DARK, INTERFACE_FONT_MONOSPACE,
  INTERFACE_FONT_PIXEL,
} from '~const/interface';
import { Component } from '~lib/ui';
import { PlayerStat } from '~type/world/entities/player';

type Props = {
  stat: PlayerStat
  record: PlayerStat
};

export const ComponentGameOver = Component<Props>(function (container, {
  stat, record,
}) {
  const { canvas } = this.sys;

  const background = this.add.rectangle(0, 0, canvas.width, canvas.height, 0x000000, 0.85);
  background.setOrigin(0.0, 0.0);

  const box = this.add.container(canvas.width / 2, canvas.height / 2);

  const title = this.add.text(0, -50, 'GAME OVER', {
    color: INTERFACE_TEXT_COLOR_ERROR_DARK,
    fontSize: '100px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 8 },
    shadow: {
      offsetX: 8,
      offsetY: 8,
      color: '#000',
      blur: 0,
      fill: true,
    },
  });
  title.setOrigin(0.5, 1.0);
  this.tweens.add({
    targets: title,
    scale: 1.2,
    duration: 1500,
    ease: 'Linear',
    yoyo: true,
  });

  const text = this.add.text(0, 50, [
    `COMPLETED WAVES - ${stat.waves}${(record.waves < stat.waves) ? ' - NEW RECORD' : ''}`,
    `KILLED ENEMIES - ${stat.kills}${(record.kills < stat.kills) ? ' - NEW RECORD' : ''}`,
    `REACHED LEVEL - ${stat.level}${(record.level < stat.level) ? ' - NEW RECORD' : ''}`,
    `LIVED MINUTES - ${stat.lived.toFixed(1)}${(record.lived < stat.lived) ? ' - NEW RECORD' : ''}`,
  ], {
    fontSize: '14px',
    fontFamily: INTERFACE_FONT_MONOSPACE,
    // @ts-ignore
    lineSpacing: 8,
  });
  text.setAlpha(0.75);
  text.setOrigin(0.5, 0.0);

  box.add([title, text]);

  container.add([background, box]);
});
