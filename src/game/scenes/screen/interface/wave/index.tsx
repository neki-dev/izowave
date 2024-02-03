import {
  useClick, useEvent, useGame, useScene, useSceneUpdate,
} from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import { IGame, GameScene, GameEvents } from '../../../../types';
import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';
import { Utils } from '~lib/utils';
import { Hint } from '~scene/system/interface/hint';
import { IWorld } from '~scene/world/types';
import { WAVE_TIMELEFT_ALARM } from '~scene/world/wave/const';

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
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const refContainer = useRef<HTMLDivElement>(null);

  const [currentNumber, setCurrentNumber] = useState(1);
  const [value, setValue] = useState<Nullable<number | string>>(null);
  const [isGoing, setGoing] = useState(false);
  const [isAlarm, setAlarm] = useState(false);
  const [isGamePaused, setGamePaused] = useState(false);
  const [isTimePaused, setTimePaused] = useState(true);
  const [hint, setHint] = useState(false);

  useClick(refContainer, 'down', () => {
    if (!world.wave.isGoing) {
      world.wave.skipTimeleft();
    }
  }, []);

  useEffect(() => (
    Tutorial.Bind(TutorialStep.SKIP_TIMELEFT, {
      beg: () => setHint(true),
      end: () => setHint(false),
    })
  ), []);

  useEvent(game.events, GameEvents.TOGGLE_PAUSE, (paused: boolean) => {
    setGamePaused(paused);
  }, []);

  useSceneUpdate(world, () => {
    setTimePaused(world.isTimePaused());
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
        && !world.wave.isPeaceMode
        && !world.isTimePaused()
      );

      setValue(world.wave.isPeaceMode ? '-' : Utils.FormatTime(timeleft));
      setAlarm(currentIsAlarm);
    }
  }, []);

  return (
    <Wrapper>
      <Container ref={refContainer} $skippable={!isGoing && !isTimePaused}>
        <CurrentNumber $paused={isTimePaused} $going={isGoing}>
          {isTimePaused ? '||' : currentNumber}
        </CurrentNumber>
        <State>
          <Label>{phrase(isGoing ? 'WAVE_ENEMIES' : 'WAVE_TIMELEFT')}</Label>
          <Value
            $attention={isAlarm}
            style={{
              animationPlayState: isGamePaused ? 'paused' : 'running',
            }}
          >
            {value}
          </Value>
        </State>
        {(!hint && !isGoing && !isTimePaused) && (
          <Placeholder>{phrase('SKIP_WAVE_TIMELEFT')}</Placeholder>
        )}
      </Container>
      {hint && (
        <Hint label='TUTORIAL_SKIP_TIMELEFT' side="top" />
      )}
    </Wrapper>
  );
};
