import React from 'react';

import { CrystalsAmount } from './crystals-amount';
import { RelativeBuildingInfo } from './relative-building-info';
import { RelativeHints } from './relative-hints';

export const WorldUI: React.FC = () => (
  <>
    <RelativeBuildingInfo />
    <RelativeHints />
    <CrystalsAmount />
  </>
);

WorldUI.displayName = 'WorldUI';
