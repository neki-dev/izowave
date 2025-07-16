import React from 'react';

import imageScore from './images/score.png';

import { phrase } from '~core/lang';

import { Wrapper, Amount, Icon, Label, Value } from './styles';

type Props = {
  value: number
};

export const Record: React.FC<Props> = ({ value }) => (
  <Wrapper>
    <Label>{phrase('RECORD')}</Label>
    <Value>
      <Icon src={imageScore} />
      <Amount>{value}</Amount>
    </Value>
  </Wrapper>
);
