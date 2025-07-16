import { Texture } from 'phaser-react-ui';
import React from 'react';

import { phrase } from '~core/lang';
import type { BuildingParam } from '~scene/world/entities/building/types';

import {
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

export const Params: React.FC<Props> = ({ list }) => (
  <Wrapper>
    {list.map((param) => (
      <Param key={param.label}>
        <IconContainer>
          <Texture name={param.icon} />
        </IconContainer>
        <Info $attention={param.attention}>
          <Label>{phrase(param.label)}</Label>
          <Value>{param.value}</Value>
        </Info>
      </Param>
    ))}
  </Wrapper>
);
