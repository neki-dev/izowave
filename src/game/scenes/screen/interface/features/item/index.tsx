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
  const scene = useScene(GameScene.BASIC);

  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);

  const { description, cost } = WORLD_FEATURES[type];

  const onClick = () => {
    world.useFeature(type);
  };

  useSceneUpdate(scene, () => {
    setPaused(game.onPause);
    setActive(Boolean(world.activeFeatures[type]));
  });

  return (
    <Container onClick={onClick} $active={isActive}>
      <Info>
        <Head>
          <Name>{type}</Name>
          <Cost type="resources" view="small" value={cost} />
        </Head>
        <Description>{description}</Description>
      </Info>
      {isActive && (
        <Timeout
          style={{
            animationDuration: `${WORLD_FEATURES[type].duration}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      )}
      <Icon
        src={`assets/sprites/interface/feature/${type.toLowerCase()}.png`}
      />
    </Container>
  );
};
