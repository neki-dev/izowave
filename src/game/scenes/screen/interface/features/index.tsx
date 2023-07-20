import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld, WorldFeature } from '~type/world';

import { ComponentFeatureItem } from './item';
import { Wrapper } from './styles';

export const ComponentFeatures: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isAvailable, setAvailable] = useState(false);

  const features = useMemo(
    () => Object.keys(WorldFeature) as WorldFeature[],
    [],
  );

  useSceneUpdate(world, () => {
    setAvailable(world.wave.number > 1);
  });

  return isAvailable && (
    <Wrapper>
      {features.map((feature) => (
        <ComponentFeatureItem key={feature} type={feature} />
      ))}
    </Wrapper>
  );
};

ComponentFeatures.displayName = 'ComponentFeatures';
