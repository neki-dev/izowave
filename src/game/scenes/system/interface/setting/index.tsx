import React from 'react';

import {
  Wrapper, Label, Values, Value,
} from './styles';
import type { InterfaceTextColor } from '~lib/interface/types';
import type { LangPhrase } from '~lib/lang/types';
import { phrase } from '~lib/lang';

type Props = {
  label: LangPhrase
  values: (LangPhrase | {
    value: LangPhrase
    color?: InterfaceTextColor
  })[]
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
      {values.map((item) => {
        const value = typeof item === 'string' ? item : item.value;
        const color = typeof item === 'string' ? undefined : item.color;

        return (
          <Value
            key={value}
            onClick={() => onChange(value)}
            $active={currentValue === value}
            $color={color}
          >
            {phrase(value)}
          </Value>
        );
      })}
    </Values>
  </Wrapper>
);
