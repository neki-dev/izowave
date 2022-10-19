import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Component } from '~lib/ui';
import { formatTime } from '~lib/utils';
import { Wave } from '~scene/world/wave';
import { NoticeType } from '~type/screen/notice';
import { WaveEvents } from '~type/world/wave';

type Props = {
  wave: Wave
};

export const ComponentWave = Component<Props>(function (container, {
  wave,
}) {
  /**
   * Body
   */

  const body = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.75);

  body.setOrigin(0.0, 0.0);
  body.adaptive = () => {
    body.setSize(container.width, container.height);
  };

  container.add(body);

  /**
   * Number
   */

  const number = this.add.text(2, 2, '', {
    resolution: window.devicePixelRatio,
    fontFamily: INTERFACE_FONT.PIXEL,
    shadow: {
      color: '#000',
      blur: 0,
      fill: true,
    },
  });

  number.adaptive = () => {
    const fontSize = container.height / 28;
    const shadow = fontSize * 3;
    const height = container.height - 4;
    const paddingX = container.width * 0.1;
    const paddingY = (height - (fontSize * 16)) / 2;

    number.setFontSize(`${fontSize}rem`);
    number.setFixedSize(0, height);
    number.setShadowOffset(shadow, shadow);
    number.setPadding(paddingX, paddingY, paddingX, 0);
  };

  container.add(number);

  /**
   * Counter label
   */

  const counterLabel = this.add.text(0, 0, '', {
    resolution: window.devicePixelRatio,
    fontFamily: INTERFACE_FONT.PIXEL,
  });

  counterLabel.setAlpha(0.75);
  counterLabel.adaptive = () => {
    const fontSize = container.height / 78;
    const offsetX = container.width * 0.07;
    const offsetY = container.height * 0.2;

    counterLabel.setFontSize(`${fontSize}rem`);
    counterLabel.setPosition(number.x + number.width + offsetX, offsetY);
  };

  container.add(counterLabel);

  /**
   * Counter value
   */

  const counterValue = this.add.text(0, 0, '', {
    resolution: window.devicePixelRatio,
    fontFamily: INTERFACE_FONT.PIXEL,
  });

  counterValue.adaptive = () => {
    const fontSize = container.height / 40;
    const offsetX = container.width * 0.07;
    const offsetY = container.height * 0.07;

    counterValue.setFontSize(`${fontSize}rem`);
    counterValue.setPosition(
      number.x + number.width + offsetX,
      counterLabel.y + counterLabel.height + offsetY,
    );
  };

  container.add(counterValue);

  /**
   * Updating
   */

  const onNumberUpdate = () => {
    if (wave.isGoing) {
      number.setBackgroundColor(INTERFACE_TEXT_COLOR.ERROR_DARK);
      number.setText(String(wave.number));
      counterLabel.setText('ENEMIES');
    } else {
      number.setBackgroundColor(INTERFACE_TEXT_COLOR.INFO_DARK);
      number.setText(String(wave.number + 1));
      counterLabel.setText('TIMELEFT');
    }

    counterLabel.adaptive();
    counterValue.adaptive();
  };

  onNumberUpdate();

  wave.on(WaveEvents.UPDATE, onNumberUpdate);

  wave.on(WaveEvents.START, () => {
    this.message(NoticeType.INFO, `WAVE ${wave.number} STARTED`);
  });

  wave.on(WaveEvents.COMPLETE, () => {
    this.message(NoticeType.INFO, `WAVE ${wave.number} COMPLETED`);
  });

  return {
    update: () => {
      if (wave.isGoing) {
        const killedCount = wave.spawnedCount - wave.scene.enemies.getTotalUsed();

        counterValue.setText(String(wave.maxSpawnedCount - killedCount));
        counterValue.setColor('#fff');
      } else {
        const timeleft = Math.ceil(wave.getTimeleft() / 1000);

        counterValue.setText(formatTime(timeleft));
        if (timeleft <= 3 && counterValue.style.color !== INTERFACE_TEXT_COLOR.ERROR) {
          counterValue.setColor(INTERFACE_TEXT_COLOR.ERROR);
          this.tweens.add({
            targets: counterValue,
            scale: 0.9,
            duration: 500,
            ease: 'Linear',
            yoyo: true,
            repeat: 3,
          });
        }
      }
    },
  };
});
