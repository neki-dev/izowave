import React from 'react';

import { ComponentAvatar } from './avatar';
import { ComponentExperience } from './experience';
import { ComponentHealth } from './health';
import { ComponentResources } from './resources';
import { Wrapper, Column } from './styles';
import { ComponentUpgrades } from './upgrades';

export const ComponentHUD: React.FC = () => (
  <Wrapper>
    <Column>
      <ComponentAvatar />
      <ComponentUpgrades />
    </Column>
    <Column>
      <ComponentHealth />
      <ComponentExperience />
      <ComponentResources />
    </Column>
  </Wrapper>
);

ComponentHUD.displayName = 'ComponentHUD';
