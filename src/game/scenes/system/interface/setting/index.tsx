import React from 'react';

import { phrase } from '~lib/lang';
import { LangPhrase } from '~type/lang';

import {
  Wrapper, Label, Values, Value,
} from './styles';

type Props = {
  label: LangPhrase
  values: LangPhrase[]
  currentValue?: LangPhrase
  onChange: (value: any) => void
};

export const Setting: React.FC<Props> = ({
  label,
  values,
  currentValue,
  onChange,
}) => (
  <Wrapper>
    <Label>{phrase(label)}</Label>
    <Values>
      {values.map((value) => (
        <Value
          key={value}
          onClick={() => onChange(value)}
          $active={currentValue === value}
        >
          {phrase(value)}
        </Value>
      ))}
    </Values>
  </Wrapper>
);
