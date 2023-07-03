import React from 'react';

import { ComponentBuildingInfo } from './building-info';
import { ComponentRelativeHint } from './relative-hint';
import { Overlay } from './styles';

export const WorldUI: React.FC = () => (
  <Overlay>
    <ComponentBuildingInfo />
    <ComponentRelativeHint />
  </Overlay>
);

WorldUI.displayName = 'WorldUI';
