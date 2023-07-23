import { useGame } from 'phaser-react-ui';
import React, { useMemo } from 'react';

import { IGame } from '~type/game';
import { MenuPage } from '~type/menu';

import { About } from './about';
import { Controls } from './controls';
import { Settings } from './settings';
import { Wrapper, Title, Body } from './styles';

type Props = {
  page: MenuPage
};

export const Content: React.FC<Props> = ({ page }) => {
  const game = useGame<IGame>();

  const Component = useMemo(() => {
    switch (page) {
      case MenuPage.SETTINGS:
        return <Settings disabled={game.onPause} />;
      case MenuPage.ABOUT:
        return <About />;
      case MenuPage.CONTROLS:
        return <Controls />;
    }
  }, [page]);

  return (
    <Wrapper>
      <Title>{page}</Title>
      <Body>{Component}</Body>
    </Wrapper>
  );
};
