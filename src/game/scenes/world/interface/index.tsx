import React from 'react';

import { RelativeBuildingInfo } from './relative-building-info';
import { RelativeHint } from './relative-hint';

export const WorldUI: React.FC = () => (
  <>
    <RelativeBuildingInfo />
    <RelativeHint />
  </>
);

WorldUI.displayName = 'WorldUI';
