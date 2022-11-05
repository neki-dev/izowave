import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Component, scaleText } from '~lib/interface';
import { PlayerStat } from '~type/world/entities/player';

type Props = {
  stat: PlayerStat
  record: PlayerStat
};

export const ComponentGameOver = Component<Props>(function (container, {
  stat, record,
}) {
  const ref: {
    background?: Phaser.GameObjects.Rectangle
    wrapper?: Phaser.GameObjects.Container
    title?: Phaser.GameObjects.Text
    stat?: Phaser.GameObjects.Text
  } = {};

  /**
   * Background
   */

  container.add(
    ref.background = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.85),
  );

  ref.background.setOrigin(0.0, 0.0);
  ref.background.useAdaptationBefore((width, height) => {
    ref.background.setSize(width, height);
  });

  /**
   * Wrapper
   */

  container.add(
    ref.wrapper = this.add.container(),
  );

  ref.wrapper.useAdaptationBefore((width, height) => {
    ref.wrapper.setPosition(width / 2, height / 2);
  });

  /**
   * Title
   */

  ref.wrapper.add(
    ref.title = this.add.text(0, 0, 'GAME OVER', {
      resolution: window.devicePixelRatio,
      color: INTERFACE_TEXT_COLOR.ERROR_DARK,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.title.setOrigin(0.5, 1.0);
  ref.title.useAdaptationBefore((width, height) => {
    scaleText(ref.title, 60, true);
    ref.title.setPosition(
      0,
      -height * 0.05,
    );
  });

  this.tweens.add({
    targets: ref.title,
    scale: 1.2,
    duration: 1500,
    ease: 'Linear',
    yoyo: true,
  });

  /**
   * Stat
   */

  ref.wrapper.add(
    ref.stat = this.add.text(0, 0, [
      `COMPLETED WAVES - ${stat.waves}${(record.waves < stat.waves) ? ' - NEW RECORD' : ''}`,
      `KILLED ENEMIES - ${stat.kills}${(record.kills < stat.kills) ? ' - NEW RECORD' : ''}`,
      `REACHED LEVEL - ${stat.level}${(record.level < stat.level) ? ' - NEW RECORD' : ''}`,
      `LIVED MINUTES - ${stat.lived.toFixed(1)}${(record.lived < stat.lived) ? ' - NEW RECORD' : ''}`,
    ], {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
      // @ts-ignore
      lineSpacing: 8,
    }),
  );

  ref.stat.setAlpha(0.75);
  ref.stat.setOrigin(0.5, 0.0);
  ref.stat.useAdaptationBefore((width, height) => {
    scaleText(ref.stat, 18);
    ref.stat.setPosition(
      0,
      height * 0.05,
    );
  });
});
