import React from 'react';

import {
  Wrapper, Label, Values, Value,
} from './styles';

type Props = {
  label: string
  values: string[]
  currentValue?: string
  onChange: (value: any) => void
};

export const Setting: React.FC<Props> = ({
  label,
  values,
  currentValue,
  onChange,
}) => (
  <Wrapper>
    <Label>{label}</Label>
    <Values>
      {values.map((value) => (
        <Value
          key={value}
          onClick={() => onChange(value)}
          $active={currentValue === value}
        >
          {value}
        </Value>
      ))}
    </Values>
  </Wrapper>
);
