import React, { useState } from 'react';

import { Overlay } from '~scene/system/interface/overlay';
import { MenuPage } from '~type/menu';

import { Content } from './content';
import { Copyright } from './copyright';
import { Navigation } from './navigation';
import {
  Wrapper, Logotype, Sidebar, Line,
} from './styles';

export const MenuUI: React.FC = () => {
  const [page, setPage] = useState(MenuPage.ABOUT);

  return (
    <Overlay>
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
