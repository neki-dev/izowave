import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerSuperskill } from '~type/world/entities/player';

import { Item } from './item';
import { Wrapper } from './styles';

export const Superskills: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const superskills = useMemo(
    () => Object.keys(PlayerSuperskill) as PlayerSuperskill[],
    [],
  );

  const [isWaveGoing, setWaveGoing] = useState(false);

  useSceneUpdate(world, () => {
    setWaveGoing(world.wave.isGoing);
  }, []);

  return isWaveGoing ? (
    <Wrapper>
      {superskills.map((superskill) => (
        <Item key={superskill} type={superskill} />
      ))}
    </Wrapper>
  ) : (
    <div />
  );
};
