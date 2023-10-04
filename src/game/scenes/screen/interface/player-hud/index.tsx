import { useMobilePlatform } from 'phaser-react-ui';
import React from 'react';

import { Section } from '~scene/system/interface/section';

import { Avatar } from './avatar';
import { Experience } from './experience';
import { Health } from './health';
import { MenuButton } from './menu-button';
import { Resources } from './resources';
import { Score } from './score';
import { Skills } from './skills';

export const PlayerHUD: React.FC = () => {
  const isMobile = useMobilePlatform();

  return (
    <Section direction='horizontal' gap={12}>
      <Section direction='vertical' gap={6}>
        {isMobile && (
          <MenuButton />
        )}
        <Section direction='vertical'>
          <Avatar />
          <Health />
        </Section>
        <Skills />
      </Section>
      <Section direction='vertical' gap={6}>
        <Score />
        <Experience />
        <Resources />
      </Section>
    </Section>
  );
};
