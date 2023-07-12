import React from 'react';

import { ComponentBuildingInfo } from './building-info';
import { ComponentRelativeHint } from './relative-hint';

export const WorldUI: React.FC = () => (
  <>
    <ComponentBuildingInfo />
    <ComponentRelativeHint />
  </>
);

WorldUI.displayName = 'WorldUI';
