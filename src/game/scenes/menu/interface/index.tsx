import cn from 'classnames';
import { useGame, useRelativeScale } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { COPYRIGHT } from '~const/game';
import { INTERFACE_SCALE } from '~const/interface';
import { IGame } from '~type/game';
import { MenuItem } from '~type/menu';

import { ComponentAbout } from './content/about';
import { ComponentControls } from './content/controls';
import { ComponentSettings } from './content/settings';
import {
  Overlay,
  Wrapper,
  Content,
  Copyright,
  Logotype,
  Menu,
  Sidebar,
  Line,
} from './styles';

export const MenuUI: React.FC = () => {
  const game = useGame<IGame>();

  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  const [currentContent, setCurrentContent] = useState('About');

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
        onClick: () => setCurrentContent('Settings'),
      },
      {
        label: 'About',
        onClick: () => setCurrentContent('About'),
      },
      {
        label: 'Controls',
        onClick: () => setCurrentContent('Controls'),
      },
    ],
    [],
  );

  const Component = useMemo(() => {
    switch (currentContent) {
      case 'Settings':
        return <ComponentSettings disabled={game.onPause} />;
      case 'About':
        return <ComponentAbout />;
      case 'Controls':
        return <ComponentControls />;
    }
  }, [currentContent]);

  const handleClick = (item: MenuItem) => {
    item.onClick();
  };

  return (
    <Overlay ref={refScale}>
      <Wrapper>
        <Sidebar>
          <Logotype>IZOWAVE</Logotype>
          <Menu>
            {menuItems.map((item) => (
              <Menu.Item
                key={item.label}
                onClick={() => handleClick(item)}
                className={cn({
                  active: item.label === currentContent,
                })}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
          <Copyright>{COPYRIGHT.join('\n')}</Copyright>
        </Sidebar>
        <Line />
        <Content>
          <Content.Title>{currentContent}</Content.Title>
          <Content.Wrapper>{Component}</Content.Wrapper>
        </Content>
      </Wrapper>
    </Overlay>
  );
};

MenuUI.displayName = 'MenuUI';
