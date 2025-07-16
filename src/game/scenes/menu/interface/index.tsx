import React, { useEffect, useState } from 'react';

import { MenuPage } from '../types';

import { Content } from './content';
import { Copyright } from './copyright';
import imageLogotype from './images/logotype.png';
import { Navigation } from './navigation';

import { Tutorial } from '~core/tutorial';
import { Overlay } from '~scene/system/interface/overlay';

import { Wrapper, Logotype, Sidebar, Main } from './styles';

type Props = {
  defaultPage?: MenuPage
};

export const MenuUI: React.FC<Props> = ({
  defaultPage = MenuPage.NEW_GAME,
}) => {
  const [page, setPage] = useState(defaultPage);

  useEffect(() => {
    Tutorial.ToggleHintsVisible(false);

    return () => {
      Tutorial.ToggleHintsVisible(true);
    };
  }, []);

  return (
    <Overlay>
      <Wrapper>
        <Sidebar>
          <Logotype src={imageLogotype} />
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
