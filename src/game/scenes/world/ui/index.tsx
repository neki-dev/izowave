import React from 'react';

import { ComponentBuildingInfo } from './building-info';
import { Overlay } from './styles';

export const WorldUI: React.FC = () => (
  <Overlay>
    <ComponentBuildingInfo />
  </Overlay>
);

WorldUI.displayName = 'WorldUI';
