import React from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { phrase } from '~lib/lang';
import { Hint } from '~scene/system/interface/hint';
import { LangPhrase } from '~type/lang';
import { BuildingVariant } from '~type/world/entities/building';

import { Preview } from './preview';
import {
  Container, Info, Name, Text,
} from './styles';

type Props = {
  variant: BuildingVariant
  number: number
  hint?: LangPhrase
};

export const Building: React.FC<Props> = ({ variant, number, hint }) => (
  <Container>
    <Info>
      <Name>{phrase(BUILDINGS[variant].Name)}</Name>
      <Text>{phrase(BUILDINGS[variant].Description)}</Text>
    </Info>
    {hint && <Hint label={hint} side="right" />}
    <Preview variant={variant} number={number} />
  </Container>
);
