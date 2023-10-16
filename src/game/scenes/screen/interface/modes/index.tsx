import { useMobilePlatform } from 'phaser-react-ui';
import React from 'react';

import { mapEntries } from '~lib/utils';
import { WorldMode } from '~type/world';

import { Item } from './item';
import { Wrapper } from './styles';

export const Modes: React.FC = () => {
  const isMobile = useMobilePlatform();

  // TODO: Add UI for mobile devices
  return !isMobile && (
    <Wrapper>
      {mapEntries(WorldMode, (key, mode) => (
        <Item key={key} mode={mode} />
      ))}
    </Wrapper>
  );
};
