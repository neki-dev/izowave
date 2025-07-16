import React, { useMemo } from 'react';

import { phrase } from '~core/lang';
import type { LangPhrase } from '~core/lang/types';

import { Positioner, Wrapper, Container, Key } from './styles';

type Props = {
  side: 'left' | 'right' | 'top' | 'bottom'
  align?: 'left' | 'center' | 'right'
  label: LangPhrase
};

export const Hint: React.FC<Props> = ({
  label,
  side,
  align = 'center',
}) => {
  const content = useMemo(() => {
    const value = phrase(label);

    if (typeof value === 'string' && /\[[\w\s]+\]/.test(value)) {
      const [before, after] = value.split(/\[[\w\s]+\]/);

      return (
        <React.Fragment>
          {before}
          <Key>{value.replace(/[\s\S]*\[([\w\s]+)\][\s\S]*/, '$1').toUpperCase()}</Key>
          {after}
        </React.Fragment>
      );
    }

    return value;
  }, [label]);

  return (
    <Wrapper role="hint">
      <Positioner $side={side} $align={align}>
        <Container>{content}</Container>
      </Positioner>
    </Wrapper>
  );
};
