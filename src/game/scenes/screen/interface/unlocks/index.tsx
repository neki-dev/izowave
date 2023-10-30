import { useEvent, useGame, useScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { GameScene, IGame } from '~type/game';
import { IWorld } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';
import { PlayerEvents, PlayerSuperskill } from '~type/world/entities/player';
import { WaveEvents } from '~type/world/wave';

import { Modal } from './modal';

export type Feature = {
  type: 'BUILDING' | 'SUPERSKILL'
  item: BuildingVariant | PlayerSuperskill
};

export const Unlocks: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [features, setFeatures] = useState<Feature[]>([]);

  const isListEmpty = features.length === 0;

  const onClose = () => {
    setFeatures([]);
  };

  useEvent(world.wave, WaveEvents.COMPLETE, (number: number) => {
    const list: Feature[] = [];

    Object.values(BuildingVariant).forEach((building) => {
      if (
        !world.builder.isBuildingAllowByWave(building, number)
        && world.builder.isBuildingAllowByWave(building, world.wave.number)
      ) {
        list.push({
          type: 'BUILDING',
          item: building,
        });
      }
    });

    setFeatures((current) => list.concat(current));
  }, []);

  useEvent(world.player, PlayerEvents.UNLOCK_SUPERSKILL, (superskill: PlayerSuperskill) => {
    setFeatures((current) => current.concat([{
      type: 'SUPERSKILL',
      item: superskill,
    }]));
  }, []);

  useEffect(() => {
    if (isListEmpty) {
      return;
    }

    setTimeout(() => {
      game.toggleSystemPause(true);
    }, 200);

    return () => {
      game.toggleSystemPause(false);
    };
  }, [isListEmpty]);

  return features.length > 0 && (
    <Modal features={features} onClose={onClose} />
  );
};
