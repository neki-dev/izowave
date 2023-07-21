import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld, WorldFeature } from '~type/world';

import { FeatureItem } from './item';
import { Wrapper } from './styles';

export const Features: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isAvailable, setAvailable] = useState(false);

  const features = useMemo(
    () => Object.keys(WorldFeature) as WorldFeature[],
    [],
  );

  useSceneUpdate(world, () => {
    setAvailable(world.wave.number >= 1); // ?
  });

  return isAvailable && (
    <Wrapper>
      {features.map((feature) => (
        <FeatureItem key={feature} type={feature} />
      ))}
    </Wrapper>
  );
};
