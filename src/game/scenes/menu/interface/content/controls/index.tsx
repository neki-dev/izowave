import React from 'react';

import { CONTROLS } from '~core/controls/const';
import { phrase } from '~core/lang';

import { Wrapper, Control, Keys, Key, Description } from './styles';

export const Controls: React.FC = () => (
  <Wrapper>
    {CONTROLS.map((control, index) => (
      <Control key={index}>
        <Keys>
          {control.keys.split(',').map((key) => (
            <Key key={key}>{key}</Key>
          ))}
        </Keys>
        <Description>- {phrase(control.label)}</Description>
      </Control>
    ))}
  </Wrapper>
);
