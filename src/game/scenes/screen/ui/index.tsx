import React from 'react';

import { ComponentBarExperience } from './bar-experience';
import { ComponentBarHealth } from './bar-health';
import { ComponentBuilder } from './builder';
import { ComponentDebugCounter } from './debug-counter';
import { ComponentNotices } from './notices';
import { ComponentResources } from './resources';
import {
  Bars, Column, Info, Overlay,
} from './styles';
import { ComponentWave } from './wave';

export const ScreenUI: React.FC = () => (
  <Overlay>
    <ComponentNotices />

    <Column>
      <Info>
        <ComponentWave />
        <Bars>
          <ComponentBarHealth />
          <ComponentBarExperience />
        </Bars>
        <ComponentResources />
      </Info>

      <ComponentDebugCounter />
    </Column>

    <Column>
      <ComponentBuilder />
    </Column>
  </Overlay>
);

ScreenUI.displayName = 'ScreenUI';
