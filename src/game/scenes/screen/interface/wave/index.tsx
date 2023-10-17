import { useClick, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import { WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { phrase } from '~lib/lang';
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
  Placeholder,
} from './styles';

export const Wave: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refWaveNumber = useRef<HTMLDivElement>(null);

  const [currentNumber, setCurrentNumber] = useState(1);
  const [value, setValue] = useState<Nullable<number | string>>(null);
  const [isGoing, setGoing] = useState(false);
  const [isAlarm, setAlarm] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [isPaused, setPaused] = useState(true);

  useClick(refWaveNumber, 'down', () => {
    if (!world.wave.isGoing) {
      world.wave.skipTimeleft();
    }
  }, [isDisabled]);

  useSceneUpdate(world, () => {
    setDisabled(world.wave.isPeaceMode);

    if (world.wave.isPeaceMode) {
      return;
    }

    setPaused(world.isTimePaused());
    setCurrentNumber(world.wave.number);
    setGoing(world.wave.isGoing);

    if (world.wave.isGoing) {
      const enemiesLeft = world.wave.getEnemiesLeft();

      setValue(enemiesLeft);
      setAlarm(false);
    } else {
      const timeleft = world.wave.getTimeleft();
      const currentIsAlarm = (
        timeleft <= WAVE_TIMELEFT_ALARM
        && !world.isTimePaused()
      );

      setValue(formatTime(timeleft));
      setAlarm(currentIsAlarm);
    }
  }, []);

  return isDisabled ? (
    <div />
  ) : (
    <Wrapper>
      <Container>
        <CurrentNumber ref={refWaveNumber} $paused={isPaused} $going={isGoing}>
          {isPaused ? '||' : currentNumber}
          {(!isGoing && !isPaused) && (
            <Placeholder>{phrase('SKIP_WAVE_TIMELEFT')}</Placeholder>
          )}
        </CurrentNumber>
        <State>
          <Label>{phrase(isGoing ? 'WAVE_ENEMIES' : 'WAVE_TIMELEFT')}</Label>
          <Value $attention={isAlarm}>{value}</Value>
        </State>
      </Container>
    </Wrapper>
  );
};
