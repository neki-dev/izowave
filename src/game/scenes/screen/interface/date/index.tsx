import {
  useClick, useEvent, useGame, useScene, useSceneUpdate,
} from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import { GameScene, GameEvent } from '../../../../types';

import type { IGame } from '../../../../types';
import type { IWorld } from '~scene/world/types';

import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';
import { Utils } from '~lib/utils';
import { Hint } from '~scene/system/interface/hint';
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

export const Date: React.FC = () => {
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
    //if (!world.wave.isGoing) {
      //world.wave.skipTimeleft();
    //}
    
    // Toggle system pause on click
    console.log('Toggle system pause on click - ' + game.isSystemPaused());
    if (game.isSystemPaused())
      game.toggleSystemPause(false);
    else
      game.toggleSystemPause(true);

  }, []);

  useEffect(() => (
    Tutorial.Bind(TutorialStep.SKIP_TIMELEFT, {
      beg: () => setHint(true),
      end: () => setHint(false),
    })
  ), []);

  useEvent(game.events, GameEvent.TOGGLE_PAUSE, (paused: boolean) => {
    setGamePaused(paused);
  }, []);

  useSceneUpdate(world, () => {
    setTimePaused(world.isTimePaused());
    
    // Current number is now the number of days passed since the game started
    //setCurrentNumber(world.wave.number);
    setCurrentNumber(Math.floor(world.getTime() / 1000));
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
        <CurrentNumber $paused={isGamePaused} >
          {currentNumber}
        </CurrentNumber>
        <State>
          <Label>{phrase('DAYS')} </Label>
          <Value
            $attention={isAlarm}
            style={{
              animationPlayState: isGamePaused ? 'paused' : 'running',
            }}
          >
            {isGamePaused ? 'paused' : ''}
          </Value>
        </State>
        {(!hint && !isGoing && !isTimePaused) && (
          <Placeholder>{phrase('PAUSE_RESUME')}</Placeholder>
        )}
      </Container>
      {hint && (
        <Hint label='TUTORIAL_SKIP_TIMELEFT' side="top" />
      )}
    </Wrapper>
  );
};
