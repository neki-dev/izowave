import React from 'react';

import { ComponentBuilder } from '~interface/builder';
import { ComponentDebug } from '~interface/debug';
import { ComponentBarExperience } from '~interface/hud/bar-experience';
import { ComponentBarHealth } from '~interface/hud/bar-health';
import { ComponentResources } from '~interface/hud/resources';
import { ComponentWave } from '~interface/hud/wave';
import { ComponentNotices } from '~interface/plates/notices';

import { Column, HUD, Overlay } from './styles';

export const ScreenUI: React.FC = () => (
  <Overlay>
    <ComponentNotices />

    <Column>
      <HUD>
        <ComponentWave />
        <HUD.Bars>
          <ComponentBarHealth />
          <ComponentBarExperience />
        </HUD.Bars>
        <ComponentResources />
      </HUD>

      <ComponentDebug />
    </Column>

    <Column>
      <ComponentBuilder />
    </Column>
  </Overlay>
);

ScreenUI.displayName = 'ScreenUI';
