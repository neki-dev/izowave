import { formatTime } from '~lib/utils';
import Component from '~lib/ui';
import Wave from '~scene/world/wave';

import { WaveEvents } from '~type/wave';
import { NoticeType } from '~type/interface';

import {
  INTERFACE_TEXT_COLOR_ERROR, INTERFACE_FONT_PIXEL,
  INTERFACE_BOX_COLOR_ERROR, INTERFACE_BOX_COLOR_INFO,
} from '~const/interface';

type Props = {
  wave: Wave
  x: number
  y: number
};

const CONTAINER_WIDTH = 130;
const CONTAINER_HEIGHT = 36;

export default Component(function ComponentWave(container, { wave }: Props) {
  container.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);

  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0x000000, 0.75);
  body.setOrigin(0.0, 0.0);

  const numberBody = this.add.rectangle(2, 2, 0, CONTAINER_HEIGHT - 4, 0x83a81c);
  numberBody.setOrigin(0.0, 0.0);

  const number = this.add.text(1, CONTAINER_HEIGHT / 2 - 1, '', {
    fontSize: '20px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: {
      bottom: 1,
      left: 12,
      right: 12,
    },
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: '#000',
      blur: 0,
      fill: true,
    },
  });
  number.setOrigin(0.0, 0.5);

  const counterLabel = this.add.text(0, 7, '', {
    fontSize: '7px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 1 },
  });
  counterLabel.setAlpha(0.75);
  counterLabel.setOrigin(0.0, 0.0);

  const counter = this.add.text(0, CONTAINER_HEIGHT - 14, '', {
    fontSize: '14px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 1 },
  });
  counter.setOrigin(0.0, 0.5);

  container.add([body, numberBody, number, counterLabel, counter]);

  const onNumberUpdate = () => {
    if (wave.isGoing) {
      numberBody.fillColor = INTERFACE_BOX_COLOR_ERROR;
      number.setText(String(wave.number));
      counterLabel.setText('ENEMIES');
    } else {
      numberBody.fillColor = INTERFACE_BOX_COLOR_INFO;
      number.setText(String(wave.number + 1));
      counterLabel.setText('TIMELEFT');
    }
    numberBody.width = number.width;
    counterLabel.setX(2 + numberBody.width + 10);
    counter.setX(2 + numberBody.width + 10);
  };
  onNumberUpdate();

  wave.on(WaveEvents.UPDATE, onNumberUpdate);
  wave.on(WaveEvents.START, () => {
    this.message(NoticeType.INFO, `WAVE ${wave.number} STARTED`);
  });
  wave.on(WaveEvents.FINISH, () => {
    this.message(NoticeType.INFO, `WAVE ${wave.number} COMPLETED`);
  });

  return {
    update: () => {
      if (wave.isGoing) {
        const killedCount = wave.spawnedCount - wave.scene.getEnemies().getTotalUsed();
        counter.setText(String(wave.maxSpawnedCount - killedCount));
        counter.setColor('#fff');
      } else {
        const timeleft = Math.ceil(wave.getTimeleft() / 1000);
        counter.setText(formatTime(timeleft));
        if (timeleft <= 3 && counter.style.color !== INTERFACE_TEXT_COLOR_ERROR) {
          counter.setColor(INTERFACE_TEXT_COLOR_ERROR);
          this.tweens.add({
            targets: counter,
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
