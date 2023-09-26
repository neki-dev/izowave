import { useGame } from 'phaser-react-ui';
import React, { useMemo } from 'react';

import { GameState, IGame } from '~type/game';
import { MenuItem, MenuPage } from '~type/menu';

import { Wrapper, Item, Space } from './styles';

type Props = {
  page?: MenuPage
  onSelect: (page: MenuPage) => void
};

export const Navigation: React.FC<Props> = ({ page, onSelect }) => {
  const game = useGame<IGame>();

  const menuItems = useMemo(() => {
    const items: (MenuItem | null)[] = [];

    if (game.state === GameState.IDLE) {
      items.push({
        label: 'New game',
        page: MenuPage.NEW_GAME,
      }, {
        label: 'Load game',
        page: MenuPage.LOAD_GAME,
      });
    } else {
      items.push({
        label: 'Continue',
        onClick: () => game.resumeGame(),
      }, {
        label: 'Save game',
        page: MenuPage.SAVE_GAME,
        disabled: game.world.wave.isGoing,
      }, {
        label: 'Main menu',
        page: MenuPage.NEW_GAME,
        onClick: () => {
          // eslint-disable-next-line no-alert
          if (window.confirm('Do you confirm stop game?')) {
            game.stopGame();
          }
        },
      });
    }

    items.push(null, {
      label: 'Settings',
      page: MenuPage.SETTINGS,
    }, {
      label: 'About game',
      page: MenuPage.ABOUT_GAME,
    }, {
      label: 'Controls',
      page: MenuPage.CONTROLS,
    });

    return items;
  }, []);

  return (
    <Wrapper>
      {menuItems.map((item, index) => (item ? (
        <Item
          key={item.label}
          onClick={item.onClick ?? (() => item.page && onSelect(item.page))}
          $active={item.page === page}
          $disabled={item.disabled}
        >
          {item.label}
        </Item>
      ) : (
        <Space key={index} />
      )))}
    </Wrapper>
  );
};
