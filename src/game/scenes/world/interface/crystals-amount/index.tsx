import { useScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { WorldScene } from '../..';
import type { Crystal } from '../../entities/crystal';

import { Amount } from './amount';

import { GameScene } from '~game/types';
import type { CrystalAmount } from '~scene/world/entities/crystal/types';
import { CrystalEvents } from '~scene/world/entities/crystal/types';
import { EntityType } from '~scene/world/entities/types';

export const CrystalsAmount: React.FC = () => {
  const world = useScene<WorldScene>(GameScene.WORLD);

  const [amounts, setAmounts] = useState<Record<string, CrystalAmount>>({});

  const showAmount = (crystal: Crystal, value: number) => {
    setAmounts((current) => ({
      ...current,
      [uuidv4()]: {
        position: {
          x: crystal.x,
          y: crystal.y,
        },
        value,
      },
    }));
  };

  const hideAmount = (id: string) => {
    setAmounts((current) => {
      if (!current[id]) {
        return current;
      }

      const newAmounts = { ...current };

      delete newAmounts[id];

      return newAmounts;
    });
  };

  useEffect(() => {
    const crystals = world.getEntitiesGroup(EntityType.CRYSTAL);

    crystals.on(CrystalEvents.PICKUP, showAmount);

    return () => {
      crystals.off(CrystalEvents.PICKUP, showAmount);
    };
  }, []);

  return Object.entries(amounts).map(([id, amount]) => (
    <Amount
      key={id}
      position={amount.position}
      value={amount.value}
      onHide={() => hideAmount(id)}
    />
  ));
};
