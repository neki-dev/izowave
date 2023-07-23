import React from 'react';

import { Avatar } from './avatar';
import { Experience } from './experience';
import { Health } from './health';
import { Resources } from './resources';
import { Wrapper, Space, Group } from './styles';
import { Upgrades } from './upgrades';

export const PlayerHUD: React.FC = () => (
  <Wrapper>
    <Group>
      <Avatar />
      <Health />
      <Space />
      <Upgrades />
    </Group>
    <Group>
      <Experience />
      <Space />
      <Resources />
    </Group>
  </Wrapper>
);
