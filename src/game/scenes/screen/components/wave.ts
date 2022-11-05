import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';
import { formatTime } from '~lib/utils';
import { ComponentHelp } from '~scene/screen/components/help';
import { NoticeType } from '~type/screen/notice';
import { TutorialEvent, TutorialStep } from '~type/tutorial';
import { WaveAudio, WaveEvents } from '~type/world/wave';

export const ComponentWave = Component(function (container) {
  const ref: {
    help?: Phaser.GameObjects.Container
    number?: Phaser.GameObjects.Text
    label?: Phaser.GameObjects.Text
    value?: Phaser.GameObjects.Text
  } = {};

  const state: {
    number: number
    enemies: number
    timeleft: number
    isGoing: boolean
  } = {
    number: null,
    enemies: null,
    timeleft: null,
    isGoing: null,
  };

  /**
   * Adaptation
   */

  container.useAdaptationBefore(() => {
    // eslint-disable-next-line no-param-reassign
    container.height = switchSize(34);
  });

  /**
   * Creating
   */

  /**
   * Number
   */

  container.add(
    ref.number = this.add.text(0, 0, '', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.number.useAdaptationBefore(() => {
    scaleText(ref.number, 20, true);

    const paddingX = switchSize(16);
    const paddingY = switchSize(6);

    ref.number.setFixedSize(0, container.height);
    ref.number.setPadding(paddingX, paddingY, paddingX, 0);
  });

  /**
   * Label
   */

  container.add(
    ref.label = this.add.text(0, 0, '', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.label.setAlpha(0.5);
  ref.label.useAdaptationBefore(() => {
    scaleText(ref.label, 10, true);
    ref.label.setPosition(
      ref.number.x + ref.number.width + switchSize(10),
      switchSize(2),
    );
  });

  /**
   * Value
   */

  container.add(
    ref.value = this.add.text(0, 0, '', {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      shadow: {
        fill: true,
      },
    }),
  );

  ref.value.useAdaptationBefore(() => {
    scaleText(ref.value, 18, true);
    ref.value.setPosition(
      ref.number.x + ref.number.width + switchSize(10),
      ref.label.y + ref.label.height + switchSize(2),
    );
  });

  /**
   * Updating
   */

  this.game.world.wave.on(WaveEvents.START, () => {
    this.message(NoticeType.INFO, `WAVE ${this.game.world.wave.number} STARTED`);
  });

  this.game.world.wave.on(WaveEvents.COMPLETE, () => {
    this.message(NoticeType.INFO, `WAVE ${this.game.world.wave.number} COMPLETED`);
  });

  this.game.tutorial.on(TutorialEvent.PROGRESS, (step: TutorialStep) => {
    if (step === TutorialStep.WAVE_TIMELEFT) {
      container.add(
        ref.help = ComponentHelp(this, {
          message: 'Here display time left to start enemies attack',
          side: 'left',
        }),
      );

      ref.help.setPosition(
        ref.label.x + ref.label.width + switchSize(12),
        container.height / 2,
      );
    } else if (ref.help) {
      ref.help.destroy();
      delete ref.help;
    }
  });

  return {
    update: () => {
      if (state.isGoing !== this.game.world.wave.isGoing) {
        if (this.game.world.wave.isGoing) {
          ref.number.setBackgroundColor(INTERFACE_TEXT_COLOR.ERROR_DARK);
          ref.label.setText('ENEMIES LEFT');
          ref.value.setColor('#fff');
        } else {
          ref.number.setBackgroundColor(INTERFACE_TEXT_COLOR.INFO_DARK);
          ref.label.setText('TIME LEFT');
        }

        state.isGoing = this.game.world.wave.isGoing;
      }

      const currentNumber = this.game.world.wave.getCurrentNumber();

      if (state.number !== currentNumber) {
        ref.number.setText(String(currentNumber));

        ref.label.refreshAdaptation();
        ref.value.refreshAdaptation();

        state.number = currentNumber;
      }

      if (this.game.world.wave.isGoing) {
        const currentEnemies = this.game.world.wave.scene.entityGroups.enemies.getTotalUsed();
        const killedEnemies = this.game.world.wave.spawnedCount - currentEnemies;
        const leftEnemies = this.game.world.wave.maxSpawnedCount - killedEnemies;

        if (state.enemies !== leftEnemies) {
          ref.value.setText(String(leftEnemies));

          state.enemies = leftEnemies;
        }
      } else {
        const currentTimeleft = Math.ceil(this.game.world.wave.getTimeleft() / 1000);

        if (state.timeleft !== currentTimeleft) {
          ref.value.setText(formatTime(currentTimeleft));

          state.timeleft = currentTimeleft;
        }

        if (
          currentTimeleft <= 5
          && ref.value.style.color !== INTERFACE_TEXT_COLOR.ERROR
          && this.game.tutorial.step > TutorialStep.WAVE_TIMELEFT
        ) {
          this.sound.play(WaveAudio.TICK);

          let repeats = currentTimeleft;
          const tick = setInterval(() => {
            repeats--;
            if (repeats === 0) {
              clearInterval(tick);
            } else {
              this.sound.play(WaveAudio.TICK);
            }
          }, 1000);

          ref.value.setColor(INTERFACE_TEXT_COLOR.ERROR);
          this.tweens.add({
            targets: ref.value,
            scale: 0.9,
            duration: 500,
            ease: 'Linear',
            yoyo: true,
            repeat: repeats - 1,
          });
        }
      }
    },
  };
});
