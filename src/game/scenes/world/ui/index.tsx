import React from 'react';

import { ComponentBuildingInfo } from '~interface/building/info';
import { ComponentRelativeHint } from '~interface/plates/relative-hint';

import { Overlay } from './styles';

export const WorldUI: React.FC = () => (
  <Overlay>
    <ComponentBuildingInfo />
    <ComponentRelativeHint />
  </Overlay>
);

WorldUI.displayName = 'WorldUI';
