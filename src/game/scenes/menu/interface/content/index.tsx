import React from 'react';

import { PAGES } from './const';

import type { MenuPage } from '~scene/menu/types';

import { Wrapper } from './styles';

type Props = {
  page?: MenuPage
};

export const Content: React.FC<Props> = ({ page }) => {
  const PageComponent = page && PAGES[page];

  return (
    <Wrapper>
      {PageComponent && <PageComponent />}
    </Wrapper>
  );
};
