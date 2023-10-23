import { useGame } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { Overlay } from '~scene/system/interface/overlay';
import { IGame } from '~type/game';
import { MenuPage } from '~type/menu';

import { Content } from './content';
import { Copyright } from './copyright';
import { Navigation } from './navigation';
import {
  Wrapper, Logotype, Sidebar, Main,
} from './styles';

type Props = {
  defaultPage?: MenuPage
};

export const MenuUI: React.FC<Props> = ({ defaultPage }) => {
  const game = useGame<IGame>();

  const [page, setPage] = useState(defaultPage);

  useEffect(() => {
    game.toggleAllHints(false);

    return () => {
      game.toggleAllHints(true);
    };
  }, []);

  return (
    <Overlay>
      <Wrapper>
        <Sidebar>
          <Logotype src="assets/logotype.png" />
          <Navigation page={page} onSelect={setPage} />
          <Copyright />
        </Sidebar>
        <Main>
          <Content page={page} />
        </Main>
      </Wrapper>
    </Overlay>
  );
};

MenuUI.displayName = 'MenuUI';
