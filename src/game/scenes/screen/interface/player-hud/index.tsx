import { useMobilePlatform } from 'phaser-react-ui';
import React from 'react';

import { Character } from './character';
import { Experience } from './experience';
import { MenuButton } from './menu-button';
import { Resources } from './resources';
import { Score } from './score';

import { Section } from '~scene/system/interface/section';

export const PlayerHUD: React.FC = () => {
  const isMobile = useMobilePlatform();

  return (
    <Section direction='horizontal' gap={12}>
      <Section direction='vertical' gap={6}>
        {isMobile && (
          <MenuButton />
        )}
        <Character />
      </Section>
      <Section direction='vertical' gap={6}>
        <Score />
        <Experience />
        <Resources />
      </Section>
    </Section>
  );
};
