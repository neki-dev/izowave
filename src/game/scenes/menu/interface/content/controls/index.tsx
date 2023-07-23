import React from 'react';

import { CONTROLS } from '~const/controls';

import {
  Control, Keys, Key, Description,
} from './styles';

export const Controls: React.FC = () => (
  <>
    {CONTROLS.map((control, index) => (
      <Control key={index}>
        <Keys>
          {control.name.split(',').map((key) => (
            <Key key={key}>{key}</Key>
          ))}
        </Keys>
        <Description>- {control.description}</Description>
      </Control>
    ))}
  </>
);
