import React from 'react';

import { CONTROLS } from '~const/controls';
import { Text } from '~scene/system/interface/text';

import {
  Wrapper, Control, Keys, Key,
} from './styles';

export const Controls: React.FC = () => (
  <Wrapper>
    {CONTROLS.map((control, index) => (
      <Control key={index}>
        <Keys>
          {control.name.split(',').map((key) => (
            <Key key={key}>{key}</Key>
          ))}
        </Keys>
        <Text>- {control.description}</Text>
      </Control>
    ))}
  </Wrapper>
);
