import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~core/interface/const';
import type { Building } from '~game/scenes/world/entities/building';
import { BuildingInfo } from '~scene/system/interface/building-info';

import { Wrapper } from './styles';

type Props = {
  building: Building
};

export const TranslateToScreen: React.FC<Props> = ({ building }) => {
  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  return (
    <Wrapper ref={refScale}>
      <BuildingInfo building={building} />
    </Wrapper>
  );
};
