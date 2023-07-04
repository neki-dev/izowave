import React from 'react';

import { ComponentAvatar } from './avatar';
import { ComponentExperience } from './experience';
import { ComponentHealth } from './health';
import { ComponentResources } from './resources';
import { Wrapper, Space, Group } from './styles';
import { ComponentUpgrades } from './upgrades';

export const ComponentHUD: React.FC = () => (
  <Wrapper>
    <Group>
      <ComponentAvatar />
      <ComponentHealth />
      <Space />
      <ComponentUpgrades />
    </Group>
    <Group>
      <ComponentExperience />
      <Space />
      <ComponentResources />
    </Group>
  </Wrapper>
);

ComponentHUD.displayName = 'ComponentHUD';
