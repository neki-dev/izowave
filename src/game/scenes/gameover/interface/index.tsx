import { useClick, useGame } from 'phaser-react-ui';
import React, { useEffect, useRef } from 'react';

import imageRestart from './images/restart.png';
import { Result } from './result';

import type { Game } from '~game/index';
import type { GameStat } from '~game/types';
import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { Overlay } from '~scene/system/interface/overlay';

import { Wrapper, Label, Button, Head, IconRestart } from './styles';

type Props = {
  stat: GameStat
  record: Nullable<GameStat>
};

export const GameoverUI: React.FC<Props> = ({ stat, record }) => {
  const game = useGame<Game>();

  const refButton = useRef<HTMLDivElement>(null);

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

GameoverUI.displayName = 'GameoverUI';
