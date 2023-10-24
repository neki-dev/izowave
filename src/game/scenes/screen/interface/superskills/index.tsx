import { useEvent, useScene } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerEvents, PlayerSuperskill } from '~type/world/entities/player';

import { Item } from './item';
import { Wrapper } from './styles';

export const Superskills: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const superskills = useMemo(() => (
    Object.keys(PlayerSuperskill) as PlayerSuperskill[]
  ), []);

  const [isAllow, setAllow] = useState(() => (
    Object.keys(world.player.unlockedSuperskills).length > 0
  ));

  useEvent(world.player, PlayerEvents.UNLOCK_SUPERSKILL, () => {
    setAllow(true);
  }, []);

  return isAllow && (
    <Wrapper>
      {superskills.map((superskill) => (
        <Item key={superskill} type={superskill} />
      ))}
    </Wrapper>
  );
};
