import { useRelativeScale } from 'phaser-react-ui';
import React, { useState } from 'react';

import { INTERFACE_SCALE } from '~const/interface';
import { MenuPage } from '~type/menu';

import { Content } from './content';
import { Copyright } from './copyright';
import { Navigation } from './navigation';
import {
  Overlay, Wrapper, Logotype, Sidebar, Line,
} from './styles';

export const MenuUI: React.FC = () => {
  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  const [page, setPage] = useState(MenuPage.ABOUT);

  return (
    <Overlay ref={refScale}>
      <Wrapper>
        <Sidebar>
          <Logotype>IZOWAVE</Logotype>
          <Navigation page={page} onSelect={setPage} />
          <Copyright />
        </Sidebar>
        <Line />
        <Content page={page} />
      </Wrapper>
    </Overlay>
  );
};

MenuUI.displayName = 'MenuUI';
