import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { formatTime } from '~lib/utils';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';

import {
  CurrentNumber,
  Container,
  State,
  Wrapper,
  Label,
  Value,
} from './styles';

export const Wave: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [currentNumber, setCurrentNumber] = useState(1);
  const [value, setValue] = useState<Nullable<number | string>>(null);
  const [isGoing, setGoing] = useState(false);
  const [isAlarm, setAlarm] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  useSceneUpdate(world, () => {
    setDisabled(world.wave.isPeaceMode || world.isTimePaused());
    setCurrentNumber(world.wave.number);
    setGoing(world.wave.isGoing);

    if (world.wave.isGoing) {
      const enemiesLeft = world.wave.getEnemiesLeft();

      setValue(enemiesLeft);
      setAlarm(false);
    } else {
      const timeleft = world.wave.getTimeleft();

      setValue(formatTime(timeleft));
      setAlarm(timeleft <= WAVE_TIMELEFT_ALARM);
    }
  });

  return isDisabled ? (
    <div />
  ) : (
    <Wrapper>
      <Container>
        <CurrentNumber $going={isGoing}>{currentNumber}</CurrentNumber>
        <State>
          <Label>{isGoing ? 'Enemies' : 'Timeleft'}</Label>
          <Value $attention={isAlarm}>{value}</Value>
        </State>
      </Container>
    </Wrapper>
  );
};
