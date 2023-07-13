import React, { useEffect, useMemo, useRef } from 'react';

import { PLAYER_UPGRADES } from '~const/world/entities/player';
import { PlayerUpgrade } from '~type/world/entities/player';

import { ComponentUpgradesListItem } from './item';
import { Container } from './styles';

type Props = {
  onClose: () => void
};

export const ComponentUpgradesList: React.FC<Props> = ({ onClose }) => {
  const refContainer = useRef<HTMLDivElement>(null);

  const upgradeTypes = useMemo(
    () => Object.keys(PLAYER_UPGRADES) as PlayerUpgrade[],
    [],
  );

  const onClickOutside = (event: MouseEvent) => {
    const isOutside = event
      .composedPath()
      .every((element) => element !== refContainer.current);

    if (isOutside) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', onClickOutside);

    return () => {
      document.removeEventListener('click', onClickOutside);
    };
  }, []);

  return (
    <Container ref={refContainer}>
      {upgradeTypes.map((type) => (
        <ComponentUpgradesListItem key={type} type={type} />
      ))}
    </Container>
  );
};

ComponentUpgradesList.displayName = 'ComponentUpgradesList';
