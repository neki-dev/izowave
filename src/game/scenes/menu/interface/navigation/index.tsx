import { useGame } from 'phaser-react-ui';
import React, { useMemo } from 'react';

import { IGame } from '~type/game';
import { MenuItem, MenuPage } from '~type/menu';

import { Wrapper, Item } from './styles';

type Props = {
  page: MenuPage
  onSelect: (page: MenuPage) => void
};

export const Navigation: React.FC<Props> = ({ page, onSelect }) => {
  const game = useGame<IGame>();

  const menuItems = useMemo<MenuItem[]>(
    () => [
      ...(game.onPause
        ? [
          {
            label: 'Continue',
            onClick: () => {
              game.resumeGame();
            },
          },
          {
            label: 'Restart',
            onClick: () => {
              // eslint-disable-next-line no-alert
              if (window.confirm('Do you confirm start new game?')) {
                game.restartGame();
              }
            },
          },
        ]
        : [
          {
            label: 'New game',
            onClick: () => {
              game.startGame();
            },
          },
        ]),
      {
        label: 'Settings',
        onClick: () => onSelect(MenuPage.SETTINGS),
      },
      {
        label: 'About',
        onClick: () => onSelect(MenuPage.ABOUT),
      },
      {
        label: 'Controls',
        onClick: () => onSelect(MenuPage.CONTROLS),
      },
    ],
    [],
  );

  return (
    <Wrapper>
      {menuItems.map((item) => (
        <Item
          key={item.label}
          onClick={item.onClick}
          $active={item.label.toUpperCase() === page}
        >
          {item.label}
        </Item>
      ))}
    </Wrapper>
  );
};
