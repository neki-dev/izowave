import React from 'react';

import {
  Wrapper, Amount, Icon, Label, Value,
} from './styles';
import { phrase } from '~lib/lang';

type Props = {
  value: number
};

export const Record: React.FC<Props> = ({ value }) => (
  <Wrapper>
    <Label>{phrase('RECORD')}</Label>
    <Value>
      <Icon src="assets/sprites/hud/score.png" />
      <Amount>{value}</Amount>
    </Value>
  </Wrapper>
);
