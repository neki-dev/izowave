import { useGame } from 'phaser-react-ui';
import React from 'react';

import { phrase } from '~core/lang';
import type { Game } from '~game/index';
import { GameState } from '~game/types';
import { Button } from '~scene/system/interface/button';

import { Icon } from './styles';

export const MenuButton: React.FC = () => {
  const game = useGame<Game>();

  const onClick = () => {
    if (game.state === GameState.STARTED) {
      game.pauseGame();
    }
  };

  return (
    <Button onClick={onClick}>
      <Icon>≡</Icon> {phrase('MENU')}
    </Button>
  );
};
