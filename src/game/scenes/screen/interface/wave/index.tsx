import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { formatTime } from '~lib/utils';
import { Hint } from '~scene/system/interface/hint';
import { IGame, GameScene } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';

import {
  CurrentNumber, Empty, Container, State, Wrapper, Label, Value,
} from './styles';

export const Wave: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [currentNumber, setCurrentNumber] = useState(1);
  const [value, setValue] = useState<Nullable<number | string>>(null);
  const [isGoing, setGoing] = useState(false);
  const [isAlarm, setAlarm] = useState(false);
  const [isPeaceMode, setPeaceMode] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(
    () => game.tutorial.bind(TutorialStep.WAVE_TIMELEFT, {
      beg: () => setHint(true),
      end: () => setHint(false),
    }),
    [],
  );

  useSceneUpdate(world, () => {
    setPeaceMode(world.wave.isPeaceMode);
    setCurrentNumber(world.wave.number);
    setGoing(world.wave.isGoing);

    if (world.wave.isGoing) {
      const enemiesLeft = world.wave.getEnemiesLeft();

      setValue(enemiesLeft);
      setAlarm(false);
    } else {
      const timeleft = world.wave.getTimeleft();

      setValue(formatTime(timeleft));
      setAlarm(timeleft <= WAVE_TIMELEFT_ALARM && !world.isTimePaused());
    }
  });

  return isPeaceMode ? (
    <Empty />
  ) : (
    <Wrapper>
      <Container>
        <CurrentNumber $going={isGoing}>
          {currentNumber}
        </CurrentNumber>
        <State>
          <Label>{isGoing ? 'ENEMIES LEFT' : 'TIME LEFT'}</Label>
          <Value $attention={isAlarm}>{value}</Value>
        </State>
      </Container>

      {hint && (
        <Hint side="top">
          Press [N] to skip timeleft
        </Hint>
      )}
    </Wrapper>
  );
};
