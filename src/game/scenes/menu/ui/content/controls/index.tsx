import React from 'react';

import { CONTROLS } from '~const/controls';

import { Control } from './styles';

export const ComponentControls: React.FC = () => (
    <>
      {CONTROLS.map((control, index) => (
        <Control key={index}>
          <Control.Keys>
            {control.name.split(' ').map((key) => (
              <Control.Key key={key}>{key}</Control.Key>
            ))}
          </Control.Keys>
          <Control.Description>- {control.description}</Control.Description>
        </Control>
      ))}
    </>
);

ComponentControls.displayName = 'ComponentControls';
