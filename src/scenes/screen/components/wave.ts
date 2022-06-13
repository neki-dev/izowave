import Phaser from 'phaser';
import Text from '~ui/text';
import Wave from '~scene/world/wave';
import Rectangle from '~ui/rectangle';

import { WaveEvents } from '~type/wave';
import { UIComponent } from '~type/interface';

type Props = {
  wave: Wave
  enemies: Phaser.GameObjects.Group
  x: number
  y: number
};

const CONTAINER_WIDTH = 230;
const CONTAINER_HEIGHT = 50;

const formatTime = (value: number) => {
  const h = Math.floor(value / 60);
  const m = value % 60;
  return `${(h < 10 ? '0' : '')}${h}:${(m < 10 ? '0' : '')}${m}`;
};

const Component: UIComponent<Props> = function ComponentWave(
  this: Phaser.Scene,
  {
    wave, enemies, x, y,
  },
) {
  const container = this.add.container(x - CONTAINER_WIDTH / 2, y)
    .setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);

  const background = new Rectangle(this, {
    size: { x: CONTAINER_WIDTH, y: CONTAINER_HEIGHT },
    position: { x: 0, y: 0 },
    origin: [0, 0],
    alpha: 0.6,
    background: 0x000000,
  });

  const body = new Rectangle(this, {
    size: { x: 0, y: 0 },
    position: { x: 10, y: 10 },
    origin: [0, 0],
    background: 0x83a81c,
  });

  const labelNumber = new Text(this, {
    position: { y: CONTAINER_HEIGHT / 2 },
    update: (self) => {
      self.setText(
        wave.isGoing ? 'CURRENT\nWAVE' : 'NEXT\nWAVE',
      );
    },
    origin: [0, 0.5],
    space: 2,
    shadow: false,
  });

  const labelCounter = new Text(this, {
    position: { x: CONTAINER_WIDTH - 10, y: CONTAINER_HEIGHT / 2 - 9 },
    update: (self) => {
      self.setText(
        wave.isGoing ? 'ENEMIES' : 'TIMELEFT',
      );
    },
    origin: [1, 0.5],
    fontSize: 8,
    shadow: false,
  });

  const counter = new Text(this, {
    position: { x: CONTAINER_WIDTH - 10, y: CONTAINER_HEIGHT / 2 + 6 },
    update: (self) => {
      if (wave.isGoing) {
        const killedCount = wave.spawnedCount - enemies.getTotalUsed();
        self.setText(String(wave.maxSpawnedCount - killedCount));
      } else {
        const timeleft = wave.getTimeleft();
        self.setText(
          formatTime(Math.ceil(timeleft / 1000)),
        );
      }
    },
    origin: [1, 0.5],
    fontSize: 16,
    shadow: false,
  });

  const number = new Text(this, {
    position: { x: 0, y: 0 },
    update: (self) => {
      self.setText(String(wave.isGoing ? wave.number : wave.number + 1));
      body.setSize(self.width + 20, CONTAINER_HEIGHT - 20);
      self.setPosition(10 + body.width / 2, CONTAINER_HEIGHT / 2);
      labelNumber.x = body.width + 20;
    },
    origin: [0.5, 0.55],
    fontSize: 22,
    shadow: false,
  });

  container.add([background, labelNumber, body, number, labelCounter, counter]);

  wave.on(WaveEvents.START, () => {
    body.fillColor = 0xdb2323;
  });

  wave.on(WaveEvents.FINISH, () => {
    body.fillColor = 0x83a81c;
  });

  return container
    .setName('ComponentWave');
};

export default Component;
