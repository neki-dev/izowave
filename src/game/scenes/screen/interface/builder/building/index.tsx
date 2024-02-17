import React from 'react';

import { Preview } from './preview';

import type { LangPhrase } from '~lib/lang/types';
import type { BuildingVariant } from '~scene/world/entities/building/types';

import { phrase } from '~lib/lang';
import { Hint } from '~scene/system/interface/hint';

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
      <Name>{phrase(`BUILDING_NAME_${variant}`)}</Name>
      <Text>{phrase(`BUILDING_DESCRIPTION_${variant}`)}</Text>
    </Info>
    {hint && <Hint label={hint} side="right" />}
    <Preview variant={variant} number={number} />
  </Container>
);
