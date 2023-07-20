import cn from 'classnames';
import React from 'react';

import { BuildingParam } from '~type/world/entities/building';

import {
  Icon,
  Info,
  IconWrapper,
  Label,
  Parameter,
  Parameters,
  Value,
} from './styles';

type Props = {
  params: BuildingParam[]
};

export const BuildingParameters: React.FC<Props> = ({ params }) => (
  <Parameters>
    {params.map((param) => (
      <Parameter key={param.label}>
        <IconWrapper>
          <Icon style={{ backgroundPositionX: `${-15 * param.icon}px` }} />
        </IconWrapper>
        <Info className={cn({ attention: param.attention })}>
          <Label>{param.label}</Label>
          <Value>{param.value}</Value>
        </Info>
      </Parameter>
    ))}
  </Parameters>
);
