import cn from 'classnames';
import React from 'react';

import { BuildingParam } from '~type/world/entities/building';

import { Parameter, Parameters } from './styles';

type Props = {
  params: BuildingParam[]
};

export const ComponentBuildingParameters: React.FC<Props> = ({ params }) => (
  <Parameters>
    {params.map((param) => (
      <Parameter key={param.label}>
        <Parameter.IconWrapper>
          <Parameter.Icon
            style={{ backgroundPositionX: `${-10 * param.icon}px` }}
          />
        </Parameter.IconWrapper>
        <Parameter.Info className={cn({ attention: param.attention })}>
          <Parameter.Label>{param.label}</Parameter.Label>
          <Parameter.Value>{param.value}</Parameter.Value>
        </Parameter.Info>
      </Parameter>
    ))}
  </Parameters>
);

ComponentBuildingParameters.displayName = 'ComponentBuildingParameters';
