import React from 'react';

import {
  Wrapper, Control, Keys, Key, Description,
} from './styles';
import { CONTROLS } from '~lib/controls/const';
import { phrase } from '~lib/lang';

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
