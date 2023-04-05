import React from 'react';

import { ComponentMenu } from '~interface/menu';

import { Overlay } from './styles';

export const MenuUI: React.FC = () => (
  <Overlay>
    <ComponentMenu />
  </Overlay>
);

MenuUI.displayName = 'MenuUI';
