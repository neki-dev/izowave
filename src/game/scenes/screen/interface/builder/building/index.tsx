import React from 'react';

import { phrase } from '~lib/lang';
import { LangPhrase } from '~lib/lang/types';
import { Hint } from '~scene/system/interface/hint';
import { BuildingVariant } from '~scene/world/entities/building/types';

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
      <Name>{phrase(`BUILDING_NAME_${variant}`)}</Name>
      <Text>{phrase(`BUILDING_DESCRIPTION_${variant}`)}</Text>
    </Info>
    {hint && <Hint label={hint} side="right" />}
    <Preview variant={variant} number={number} />
  </Container>
);
