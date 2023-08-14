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
      ...(game.isStarted
        ? [
          {
            label: 'Continue',
            onClick: () => {
              game.resumeGame();
            },
          },
          {
            label: 'New game',
            page: MenuPage.NEW_GAME,
            onClick: () => {
              // eslint-disable-next-line no-alert
              if (window.confirm('Do you confirm start new game?')) {
                game.stopGame();
              }
            },
          },
        ]
        : [
          {
            label: 'New game',
            page: MenuPage.NEW_GAME,
          },
        ]),
      {
        label: 'Settings',
        page: MenuPage.SETTINGS,
      },
      {
        label: 'About',
        page: MenuPage.ABOUT,
      },
      {
        label: 'Controls',
        page: MenuPage.CONTROLS,
      },
    ],
    [],
  );

  return (
    <Wrapper>
      {menuItems.map((item) => (
        <Item
          key={item.label}
          onClick={item.onClick ?? (() => item.page && onSelect(item.page))}
          $active={item.page === page}
        >
          {item.label}
        </Item>
      ))}
    </Wrapper>
  );
};
