import React from 'react';

import { BuildingInfo } from './building-info';
import { RelativeHint } from './relative-hint';

export const WorldUI: React.FC = () => (
  <>
    <BuildingInfo />
    <RelativeHint />
  </>
);

WorldUI.displayName = 'WorldUI';
