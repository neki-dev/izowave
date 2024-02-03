import { useEvent, useGame, useScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { IGame, GameScene } from '../../../../types';
import { BuildingVariant } from '~scene/world/entities/building/types';
import { AssistantVariant, AssistantEvents } from '~scene/world/entities/npc/assistant/types';
import { PlayerSuperskill, PlayerEvents } from '~scene/world/entities/player/types';
import { IWorld } from '~scene/world/types';
import { WaveEvents } from '~scene/world/wave/types';

import { Modal } from './modal';

export type Feature = {
  type: 'BUILDING' | 'SUPERSKILL' | 'ASSISTANT'
  item: BuildingVariant | PlayerSuperskill | AssistantVariant
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

  useEvent(world.assistant, AssistantEvents.UNLOCK_VARIANT, (variant: AssistantVariant) => {
    setFeatures((current) => current.concat([{
      type: 'ASSISTANT',
      item: variant,
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
