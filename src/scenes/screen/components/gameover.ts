import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Component, scaleText } from '~lib/ui';
import { PlayerStat } from '~type/world/entities/player';

type Props = {
  stat: PlayerStat
  record: PlayerStat
};

export const ComponentGameOver = Component<Props>(function (container, {
  stat, record,
}) {
  /**
   * Background
   */

  const background = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.85);

  background.setOrigin(0.0, 0.0);
  background.adaptive = (width, height) => {
    background.setSize(width, height);
  };

  container.add(background);

  /**
   * Wrapper
   */

  const wrapper = this.add.container();

  wrapper.adaptive = (width, height) => {
    wrapper.setPosition(width / 2, height / 2);
  };

  container.add(wrapper);

  /**
   * Title
   */

  const title = this.add.text(0, 0, 'GAME OVER', {
    resolution: window.devicePixelRatio,
    color: INTERFACE_TEXT_COLOR.ERROR_DARK,
    fontFamily: INTERFACE_FONT.PIXEL,
    shadow: {
      fill: true,
    },
  });

  title.setOrigin(0.5, 1.0);
  title.adaptive = (width, height) => {
    scaleText(title, {
      by: width,
      scale: 0.035,
      shadow: true,
    });
    title.setPosition(0, -height * 0.05);
  };

  this.tweens.add({
    targets: title,
    scale: 1.2,
    duration: 1500,
    ease: 'Linear',
    yoyo: true,
  });

  wrapper.add(title);

  /**
   * Text
   */

  const text = this.add.text(0, 0, [
    `COMPLETED WAVES - ${stat.waves}${(record.waves < stat.waves) ? ' - NEW RECORD' : ''}`,
    `KILLED ENEMIES - ${stat.kills}${(record.kills < stat.kills) ? ' - NEW RECORD' : ''}`,
    `REACHED LEVEL - ${stat.level}${(record.level < stat.level) ? ' - NEW RECORD' : ''}`,
    `LIVED MINUTES - ${stat.lived.toFixed(1)}${(record.lived < stat.lived) ? ' - NEW RECORD' : ''}`,
  ], {
    resolution: window.devicePixelRatio,
    fontFamily: INTERFACE_FONT.MONOSPACE,
    // @ts-ignore
    lineSpacing: 8,
  });

  text.setAlpha(0.75);
  text.setOrigin(0.5, 0.0);
  text.adaptive = (width, height) => {
    scaleText(text, {
      by: width,
      scale: 0.01,
    });
    text.setPosition(0, height * 0.05);
  };

  wrapper.add(text);
});
