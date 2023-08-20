import React from 'react';

import { Avatar } from './avatar';
import { Experience } from './experience';
import { Health } from './health';
import { Resources } from './resources';
import { Score } from './score';
import { Skills } from './skills';
import { Wrapper, Space, Group } from './styles';

export const PlayerHUD: React.FC = () => (
  <Wrapper>
    <Group>
      <Avatar />
      <Health />
      <Space />
      <Skills />
    </Group>
    <Group>
      <Score />
      <Space />
      <Experience />
      <Space />
      <Resources />
    </Group>
  </Wrapper>
);
