import { useGame } from 'phaser-react-ui';
import React from 'react';

import { GameState } from '../../../../../types';
import { Icon } from './styles';
import type { IGame } from '../../../../../types';
import { phrase } from '~lib/lang';
import { Button } from '~scene/system/interface/button';

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
