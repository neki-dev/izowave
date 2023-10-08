import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~const/interface';
import { BuildingInfo } from '~scene/system/interface/building-info';
import { IBuilding } from '~type/world/entities/building';

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
