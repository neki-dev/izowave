import React from 'react';

import { PLAYER_UPGRADES } from '~const/world/entities/player';
import { PlayerUpgrade } from '~type/world/entities/player';

import { ComponentUpgradesListItem } from './item';
import { Container } from './styles';

type Props = {
  onClose: () => void
};

export const ComponentUpgradesList: React.FC<Props> = () => (
  <Container>
    {Object.keys(PLAYER_UPGRADES).map((type: PlayerUpgrade) => (
      <ComponentUpgradesListItem key={type} type={type} />
    ))}
  </Container>
);

ComponentUpgradesList.displayName = 'ComponentUpgradesList';
