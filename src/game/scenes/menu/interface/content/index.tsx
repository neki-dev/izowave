import React, { useMemo } from 'react';

import { MenuPage } from '~type/menu';

import { About } from './about';
import { Controls } from './controls';
import { NewGame } from './new-game';
import { Settings } from './settings';
import { Wrapper } from './styles';

type Props = {
  page: MenuPage
};

export const Content: React.FC<Props> = ({ page }) => {
  const Component = useMemo(() => {
    switch (page) {
      case MenuPage.NEW_GAME:
        return <NewGame />;
      case MenuPage.SETTINGS:
        return <Settings />;
      case MenuPage.ABOUT:
        return <About />;
      case MenuPage.CONTROLS:
        return <Controls />;
    }
  }, [page]);

  return (
    <Wrapper>
      {Component}
    </Wrapper>
  );
};
