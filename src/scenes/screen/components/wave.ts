import { formatTime } from '~lib/utils';
import Component from '~lib/ui';
import Wave from '~scene/world/wave';

import { WaveEvents } from '~type/wave';

import { INTERFACE_PIXEL_FONT } from '~const/interface';

type Props = {
  wave: Wave
  x: number
  y: number
};

const CONTAINER_WIDTH = 230;
const CONTAINER_HEIGHT = 50;

export default Component(function ComponentWave(container, { wave }: Props) {
  container.setX(container.x - CONTAINER_WIDTH / 2);
  container.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);

  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0x000000, 0.75);
  body.setOrigin(0, 0);

  const numberBody = this.add.rectangle(10, 10, 0, CONTAINER_HEIGHT - 20, 0x83a81c);
  numberBody.setOrigin(0, 0);

  const number = this.add.text(0, CONTAINER_HEIGHT / 2, '', {
    fontSize: '22px',
    fontFamily: INTERFACE_PIXEL_FONT,
    padding: { bottom: 1 },
  });
  number.setOrigin(0.5, 0.5);

  const status = this.add.text(0, CONTAINER_HEIGHT / 2, '', {
    fontSize: '11px',
    fontFamily: INTERFACE_PIXEL_FONT,
    // @ts-ignore
    lineSpacing: 2,
  });
  status.setOrigin(0.0, 0.5);

  const counterLabel = this.add.text(CONTAINER_WIDTH - 10, CONTAINER_HEIGHT / 2 - 9, '', {
    fontSize: '8px',
    fontFamily: INTERFACE_PIXEL_FONT,
    padding: { bottom: 1 },
  });
  counterLabel.setOrigin(1.0, 0.5);

  const counter = this.add.text(CONTAINER_WIDTH - 10, CONTAINER_HEIGHT / 2 + 6, '', {
    fontSize: '16px',
    fontFamily: INTERFACE_PIXEL_FONT,
    padding: { bottom: 1 },
  });
  counter.setOrigin(1.0, 0.5);

  container.add([body, numberBody, number, status, counterLabel, counter]);

  const onNumberUpdate = () => {
    if (wave.isGoing) {
      numberBody.fillColor = 0xdb2323;
      number.setText(String(wave.number));
      counterLabel.setText('ENEMIES');
      status.setText('CURRENT\nWAVE');
    } else {
      numberBody.fillColor = 0x83a81c;
      number.setText(String(wave.number + 1));
      counterLabel.setText('TIMELEFT');
      status.setText('NEXT\nWAVE');
    }
    numberBody.width = number.width + 20;
    number.setX(10 + numberBody.width / 2);
    status.setX(numberBody.width + 20);
  };
  onNumberUpdate();

  wave.on(WaveEvents.UPDATE, onNumberUpdate);

  wave.on(WaveEvents.START, () => {
    const notify = this.add.text(this.sys.game.canvas.width / 2, -60, `WAVE ${wave.number} STARTED`, {
      fontSize: '40px',
      fontFamily: INTERFACE_PIXEL_FONT,
      padding: { bottom: 6 },
      shadow: {
        offsetX: 6,
        offsetY: 6,
        color: '#000000',
        blur: 0,
        fill: true,
      },
    });
    notify.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: notify,
      y: 200,
      duration: 1000,
      ease: 'Power2',
      hold: 2000,
      yoyo: true,
      onComplete: () => {
        notify.destroy();
      },
    });
  });

  return {
    update: () => {
      let counterValue: string;
      if (wave.isGoing) {
        const killedCount = wave.spawnedCount - wave.scene.getEnemies().getTotalUsed();
        counterValue = String(wave.maxSpawnedCount - killedCount);
      } else {
        const timeleft = wave.getTimeleft();
        counterValue = formatTime(Math.ceil(timeleft / 1000));
      }
      counter.setText(counterValue);
    },
  };
});
