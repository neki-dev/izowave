import { useGame } from 'phaser-react-ui';
import React, { useMemo } from 'react';

import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
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
        label: 'NEW_GAME',
        page: MenuPage.NEW_GAME,
      }, {
        label: 'LOAD_GAME',
        page: MenuPage.LOAD_GAME,
      });
    } else {
      items.push({
        label: 'CONTINUE',
        onClick: () => game.resumeGame(),
      }, {
        label: 'SAVE_GAME',
        page: MenuPage.SAVE_GAME,
        disabled: game.world.wave.isGoing,
      }, {
        label: 'MAIN_MENU',
        onClick: () => {
          // eslint-disable-next-line no-alert
          if (window.confirm('Do you confirm stop game?')) {
            game.stopGame();
          }
        },
      });
    }

    items.push(null, {
      label: 'SETTINGS',
      page: MenuPage.SETTINGS,
    }, {
      label: 'ABOUT_GAME',
      page: MenuPage.ABOUT_GAME,
    });

    if (game.device.os.desktop) {
      items.push({
        label: 'CONTROLS',
        page: MenuPage.CONTROLS,
      });
    }

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
          {phrase(item.label)}
        </Item>
      ) : (
        <Space key={index} />
      )))}
    </Wrapper>
  );
};
