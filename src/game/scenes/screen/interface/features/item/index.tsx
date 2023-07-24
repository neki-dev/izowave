import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { WORLD_FEATURES } from '~const/world';
import { Cost } from '~scene/system/interface/cost';
import { GameScene, IGame } from '~type/game';
import { IWorld, WorldFeature } from '~type/world';

import {
  Container,
  Timeout,
  Info,
  Icon,
  Description,
  Head,
  Name,
} from './styles';

type Props = {
  type: WorldFeature
};

export const FeatureItem: React.FC<Props> = ({ type }) => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);
  const scene = useScene(GameScene.SYSTEM);

  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [cost, setCost] = useState(0);

  const onClick = () => {
    world.useFeature(type);
  };

  useSceneUpdate(scene, () => {
    setPaused(game.onPause);
    setActive(Boolean(world.activeFeatures[type]));
    setCost(world.getFeatureCost(type));
  });

  return (
    <Container onClick={onClick} $active={isActive}>
      <Info>
        <Head>
          <Name>{type}</Name>
          <Cost type="resources" value={cost} size="small" />
        </Head>
        <Description>{WORLD_FEATURES[type].description}</Description>
      </Info>
      {isActive && (
        <Timeout
          style={{
            animationDuration: `${WORLD_FEATURES[type].duration}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      )}
      <Icon src={`assets/sprites/feature/${type.toLowerCase()}.png`} />
    </Container>
  );
};
