import { useClick, useGame } from 'phaser-react-ui';
import React, { useEffect, useRef } from 'react';

import imageRestart from './images/restart.png';
import { Result } from './result';

import { phrase } from '~core/lang';
import { Tutorial } from '~core/tutorial';
import type { Game } from '~game/index';
import { Overlay } from '~scene/system/interface/overlay';

import { Button, Head, IconRestart, Label, Wrapper } from './styles';

export const GameOver: React.FC = () => {
  const game = useGame<Game>();

  const refButton = useRef<HTMLDivElement>(null);

  const record = game.getRecordStat();
  const stat = game.getCurrentStat();

  useClick(refButton, 'down', () => {
    game.restartGame();
  }, []);

  useEffect(() => {
    Tutorial.ToggleHintsVisible(false);

    return () => {
      Tutorial.ToggleHintsVisible(true);
    };
  }, []);

  return (
    <Overlay>
      <Wrapper>
        <Head>
          <Label>GAME OVER</Label>
          <Result stat={stat} record={record} />
          <Button ref={refButton}>
            <IconRestart src={imageRestart} />
            {phrase('RESTART_GAME')}
          </Button>
        </Head>
      </Wrapper>
    </Overlay>
  );
};
