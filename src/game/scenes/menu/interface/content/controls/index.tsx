import React from 'react';

import { CONTROLS } from '~const/controls';
import { phrase } from '~lib/lang';
import { Text } from '~scene/system/interface/text';

import {
  Wrapper, Control, Keys, Key,
} from './styles';

export const Controls: React.FC = () => (
  <Wrapper>
    {CONTROLS.map((control, index) => (
      <Control key={index}>
        <Keys>
          {control.keys.split(',').map((key) => (
            <Key key={key}>{key}</Key>
          ))}
        </Keys>
        <Text>- {phrase(control.label)}</Text>
      </Control>
    ))}
  </Wrapper>
);
