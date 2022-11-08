import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';
import { GameStat } from '~type/game';
import { MenuAudio } from '~type/menu';

type Props = {
  stat: GameStat
  record: GameStat
};

export const ComponentGameOver = Component<Props>(function (container, {
  stat, record,
}) {
  const ref: {
    background?: Phaser.GameObjects.Rectangle
    wrapper?: Phaser.GameObjects.Container
    title?: Phaser.GameObjects.Text
    stat?: Record<string, {
      wrapper?: Phaser.GameObjects.Container
      value?: Phaser.GameObjects.Text
      label?: Phaser.GameObjects.Text
      record?: Phaser.GameObjects.Text
    }>
    restart?: Phaser.GameObjects.Text
  } = { stat: {} };

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
  ref.title.useAdaptationBefore(() => {
    scaleText(ref.title, 60, true);
    ref.title.setPosition(
      0,
      -switchSize(80),
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

  [
    { key: 'waves', label: 'WAVES COMPLETED', value: stat.waves },
    { key: 'level', label: 'LEVEL REACHED', value: stat.level },
    { key: 'kills', label: 'ENEMIES KILLED', value: stat.kills },
    { key: 'lived', label: 'MINUTES LIVED', value: stat.lived.toFixed(1) },
  ].forEach(({ key, label, value }, index) => {
    ref.stat[key] = {};

    /**
     * Wrapper
     */

    ref.wrapper.add(
      ref.stat[key].wrapper = this.add.container(),
    );

    ref.stat[key].wrapper.useAdaptationAfter(() => {
      ref.stat[key].wrapper.setPosition(
        -switchSize(75),
        (ref.stat[key].value.height + switchSize(10)) * index,
      );
    });

    /**
     * Value
     */

    ref.stat[key].wrapper.add(
      ref.stat[key].value = this.add.text(0, 0, String(value), {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.PIXEL,
      }),
    );

    ref.stat[key].value.setOrigin(0.0, 0.5);
    ref.stat[key].value.useAdaptationBefore(() => {
      scaleText(ref.stat[key].value, 17);
    });

    /**
     * Label
     */

    ref.stat[key].wrapper.add(
      ref.stat[key].label = this.add.text(0, 0, label, {
        // resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      }),
    );

    ref.stat[key].label.setOrigin(0.0, 0.5);
    ref.stat[key].label.setAlpha(0.9);
    ref.stat[key].label.useAdaptationBefore(() => {
      scaleText(ref.stat[key].label, 13);
      ref.stat[key].label.setPosition(
        ref.stat[key].value.width + switchSize(8),
        1,
      );
    });

    /**
     * Record
     */

    // @ts-ignore
    if (record[key] < stat[key]) {
      ref.stat[key].wrapper.add(
        ref.stat[key].record = this.add.text(0, 0, 'RECORD', {
          resolution: window.devicePixelRatio,
          fontFamily: INTERFACE_FONT.MONOSPACE,
          color: INTERFACE_TEXT_COLOR.INFO,
        }),
      );

      ref.stat[key].record.setOrigin(0.0, 0.5);
      ref.stat[key].record.useAdaptationBefore(() => {
        scaleText(ref.stat[key].record, 9);
        ref.stat[key].record.setPosition(
          ref.stat[key].label.x + ref.stat[key].label.width + switchSize(10),
          1,
        );
      });
    }
  });

  /**
   * Restart
   */

  ref.wrapper.add(
    ref.restart = this.add.text(0, 0, 'PLAY AGAIN', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      color: '#fff',
      backgroundColor: INTERFACE_TEXT_COLOR.BLUE_DARK,
      padding: {
        top: 11,
        bottom: 14,
        left: 14,
        right: 14,
      },
    }),
  );

  ref.restart.setOrigin(0.5, 0.0);
  ref.restart.setInteractive();
  ref.restart.useAdaptationBefore(() => {
    scaleText(ref.restart, 16);
    ref.restart.setPosition(
      0,
      switchSize(120),
    );
  });

  ref.restart.on(Phaser.Input.Events.POINTER_OVER, () => {
    this.input.setDefaultCursor('pointer');
    ref.restart.setBackgroundColor('#000');
  });

  ref.restart.on(Phaser.Input.Events.POINTER_OUT, () => {
    this.input.setDefaultCursor('default');
    ref.restart.setBackgroundColor(INTERFACE_TEXT_COLOR.BLUE_DARK);
  });

  ref.restart.on(Phaser.Input.Events.POINTER_UP, () => {
    this.sound.play(MenuAudio.CLICK);
    this.game.restartGame();
  });

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});
