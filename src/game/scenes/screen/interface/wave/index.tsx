import cn from 'classnames';
import React, { useContext, useEffect, useState } from 'react';

import { WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { GameContext, useWorldUpdate } from '~lib/interface';
import { formatTime } from '~lib/utils';
import { ComponentHint } from '~scene/basic/interface/hint';
import { TutorialStep } from '~type/tutorial';

import {
  CurrentNumber, Container, State, Wrapper,
} from './styles';

export const ComponentWave: React.FC = () => {
  const game = useContext(GameContext);

  const [currentNumber, setCurrentNumber] = useState(1);
  const [value, setValue] = useState(null);
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

  useWorldUpdate(() => {
    setPeaceMode(game.world.wave.isPeaceMode);
    setCurrentNumber(game.world.wave.number);
    setGoing(game.world.wave.isGoing);

    if (game.world.wave.isGoing) {
      const enemiesLeft = game.world.wave.getEnemiesLeft();

      setValue(enemiesLeft);
      setAlarm(false);
    } else {
      const timeleft = game.world.wave.getTimeleft();

      setValue(formatTime(timeleft));
      setAlarm(
        timeleft <= WAVE_TIMELEFT_ALARM
        && !game.world.isTimePaused(),
      );
    }
  });

  return (
    !isPeaceMode && (
      <Wrapper>
        <Container>
          <CurrentNumber className={cn({ going: isGoing })}>
            {currentNumber}
          </CurrentNumber>
          <State>
              <State.Label>
                {isGoing ? 'ENEMIES LEFT' : 'TIME LEFT'}
              </State.Label>
              <State.Value className={cn({ alarm: isAlarm })}>
                {value}
              </State.Value>
          </State>
        </Container>

        {hint && (
          <ComponentHint side="top">
            Here display timeleft to start enemies attack
          </ComponentHint>
        )}
      </Wrapper>
    )
  );
};

ComponentWave.displayName = 'ComponentWave';
