import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import type { IBuilding } from '~scene/world/entities/building/types';

import { INTERFACE_SCALE } from '~lib/interface/const';
import { BuildingInfo } from '~scene/system/interface/building-info';

import { Wrapper } from './styles';

type Props = {
  building: IBuilding
};

export const TranslateToScreen: React.FC<Props> = ({ building }) => {
  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  return (
    <Wrapper ref={refScale}>
      <BuildingInfo building={building} />
    </Wrapper>
  );
};
