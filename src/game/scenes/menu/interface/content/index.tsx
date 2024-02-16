import React from 'react';

import { AboutGame } from './about-game';
import { Controls } from './controls';
import { LoadGame } from './load-game';
import { NewGame } from './new-game';
import { SaveGame } from './save-game';
import { Settings } from './settings';
import { Wrapper } from './styles';
import { MenuPage } from '~scene/menu/types';

type Props = {
  page?: MenuPage
};

const PAGES: Record<MenuPage, React.FC> = {
  [MenuPage.NEW_GAME]: NewGame,
  [MenuPage.SAVE_GAME]: SaveGame,
  [MenuPage.LOAD_GAME]: LoadGame,
  [MenuPage.SETTINGS]: Settings,
  [MenuPage.ABOUT_GAME]: AboutGame,
  [MenuPage.CONTROLS]: Controls,
};

export const Content: React.FC<Props> = ({ page }) => {
  const PageComponent = page && PAGES[page];

  return (
    <Wrapper>
      {PageComponent && <PageComponent />}
    </Wrapper>
  );
};
