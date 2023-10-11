import React from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { Hint } from '~scene/system/interface/hint';
import { BuildingVariant } from '~type/world/entities/building';

import { Preview } from './preview';
import {
  Container, Info, Name, Text,
} from './styles';

type Props = {
  variant: BuildingVariant
  number: number
  hint?: string
};

export const Building: React.FC<Props> = ({ variant, number, hint }) => (
  <Container>
    <Info>
      <Name>{BUILDINGS[variant].Name}</Name>
      <Text>{BUILDINGS[variant].Description}</Text>
    </Info>
    {hint && <Hint side="right">{hint}</Hint>}
    <Preview variant={variant} number={number} isGlowing={Boolean(hint)} />
  </Container>
);
