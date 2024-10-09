import { useGame } from 'phaser-react-ui';
import React from 'react';

import type { IGame } from '~game/types';

import { GameState } from '~game/types';
import { phrase } from '~lib/lang';
import { Button } from '~scene/system/interface/button';

import { Icon } from './styles';

export const MenuButton: React.FC = () => {
  const game = useGame<IGame>();

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
