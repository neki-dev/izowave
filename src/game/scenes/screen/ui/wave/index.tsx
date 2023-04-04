import cn from 'classnames';
import React, { useContext, useEffect, useState } from 'react';

import { WAVE_ALARM_TIMELEFT } from '~const/world/wave';
import { GameContext, useWorldUpdate } from '~lib/ui';
import { formatTime } from '~lib/utils';
import { TutorialStep } from '~type/tutorial';

import { ComponentHint } from '../hint';
import { CurrentNumber, State, Wrapper } from './styles';

export const ComponentWave: React.FC = () => {
  const game = useContext(GameContext);

  const [currentNumber, setCurrentNumber] = useState(
    game.world.wave.getCurrentNumber(),
  );
  const [value, setValue] = useState(null);
  const [isGoing, setGoing] = useState(game.world.wave.isGoing);
  const [isAlarm, setAlarm] = useState(false);
  const [isHintVisible, setHintVisible] = useState(false);

  useWorldUpdate(() => {
    setCurrentNumber(game.world.wave.getCurrentNumber());
    setGoing(game.world.wave.isGoing);

    if (game.world.wave.isGoing) {
      const enemiesLeft = game.world.wave.getEnemiesLeft();

      setValue(enemiesLeft);
      setAlarm(false);
    } else {
      const timeleft = game.world.wave.getTimeleft();

      setValue(formatTime(timeleft));
      setAlarm(timeleft <= WAVE_ALARM_TIMELEFT && !game.world.isTimerPaused());
    }
  });

  useEffect(() => {
    game.tutorial.onBeg(TutorialStep.WAVE_TIMELEFT, () => {
      setHintVisible(true);
    });
    game.tutorial.onEnd(TutorialStep.WAVE_TIMELEFT, () => {
      setHintVisible(false);
    });
  });

  return (
    <Wrapper>
      <CurrentNumber className={cn({ going: isGoing })}>
        {currentNumber}
      </CurrentNumber>
      <State>
        <State.Label>{isGoing ? 'ENEMIES LEFT' : 'TIME LEFT'}</State.Label>
        <State.Value className={cn({ alarm: isAlarm })}>{value}</State.Value>
      </State>

      {isHintVisible && (
        <ComponentHint side="left">
          Here display time left to start enemies attack
        </ComponentHint>
      )}
    </Wrapper>
  );
};

ComponentWave.displayName = 'ComponentWave';
