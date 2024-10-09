import { Texture, useInteraction, useScene } from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import type { IWorld, WorldMode } from '~scene/world/types';

import { GameScene } from '~game/types';
import { phrase } from '~lib/lang';
import { WorldModeIcon } from '~scene/world/types';

import { Container, Placeholder } from './styles';

type Props = {
  mode: WorldMode
};

export const Item: React.FC<Props> = ({ mode }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refContainer = useRef<HTMLDivElement>(null);

  const [isActive, setActive] = useState(() => (
    world.isModeActive(mode)
  ));

  const isHover = useInteraction(refContainer, () => {
    world.setModeActive(mode, !isActive);
    setActive(!isActive);
  }, [mode, isActive]);

  return (
    <Container ref={refContainer} $active={isActive}>
      <Texture name={WorldModeIcon[mode]} />
      {isHover && (
        <Placeholder>{phrase(mode)}</Placeholder>
      )}
    </Container>
  );
};
