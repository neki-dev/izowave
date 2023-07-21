import React from 'react';

import { BuildingParam } from '~type/world/entities/building';

import {
  Icon,
  Info,
  IconContainer,
  Label,
  Param,
  Wrapper,
  Value,
} from './styles';

type Props = {
  list: BuildingParam[]
};

export const BuildingParams: React.FC<Props> = ({ list }) => (
  <Wrapper>
    {list.map((param) => (
      <Param key={param.label}>
        <IconContainer>
          <Icon src={`assets/sprites/${param.icon}.png`} />
        </IconContainer>
        <Info $attention={param.attention}>
          <Label>{param.label}</Label>
          <Value>{param.value}</Value>
        </Info>
      </Param>
    ))}
  </Wrapper>
);
