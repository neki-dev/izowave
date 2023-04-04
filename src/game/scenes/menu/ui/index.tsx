import cn from 'classnames';
import React, { useContext, useMemo, useState } from 'react';

import { COPYRIGHT } from '~const/game';
import { GameContext } from '~lib/ui';
import { MenuAudio, MenuItem } from '~type/menu';

import { ComponentAbout } from './about';
import { ComponentControls } from './controls';
import { ComponentDifficulty } from './difficulty';
import {
  Wrapper,
  Content,
  Copyright,
  Logotype,
  Menu,
  Overlay,
  Sidebar,
  Line,
} from './styles';

export const MenuUI: React.FC = () => {
  const game = useContext(GameContext);

  const [currentContent, setCurrentContent] = useState('About');

  const menuItems = useMemo<MenuItem[]>(
    () => [
      ...(game.paused
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
        label: 'Difficulty',
        onClick: () => setCurrentContent('Difficulty'),
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
      case 'Difficulty': return <ComponentDifficulty disabled={game.paused} />;
      case 'About': return <ComponentAbout />;
      case 'Controls': return <ComponentControls />;
      default: return null;
    }
  }, [currentContent]);

  const handleClick = (item: MenuItem) => {
    game.sound.play(MenuAudio.CLICK);
    item.onClick();
  };

  return (
    <Overlay>
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
          <Content.Wrapper>
            {Component}
          </Content.Wrapper>
        </Content>
      </Wrapper>
    </Overlay>
  );
};

MenuUI.displayName = 'MenuUI';
