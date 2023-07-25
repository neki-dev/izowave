import React, { useMemo } from 'react';

import {
  Positioner, Wrapper, Container, Key,
} from './styles';

type Props = {
  width?: number
  side: 'left' | 'right' | 'top' | 'bottom'
  align?: 'left' | 'center' | 'right'
  children: React.ReactNode
};

export const Hint: React.FC<Props> = ({
  children,
  side,
  width,
  align = 'center',
}) => {
  const content = useMemo(() => {
    const array = Array.isArray(children) ? children : [children];

    return array.map((value, i) => {
      if (typeof value === 'string' && /\[[\w\s]+\]/.test(value)) {
        const [before, after] = value.split(/\[[\w\s]+\]/);

        return (
          <React.Fragment key={i}>
            {before}
            <Key>{value.replace(/[\s\S]*\[([\w\s]+)\][\s\S]*/, '$1').toUpperCase()}</Key>
            {after}
          </React.Fragment>
        );
      }

      return value;
    });
  }, [children]);

  return (
  <Wrapper role="hint">
    <Positioner $side={side} $align={align}>
      <Container $width={width}>{content}</Container>
    </Positioner>
  </Wrapper>
  );
};
