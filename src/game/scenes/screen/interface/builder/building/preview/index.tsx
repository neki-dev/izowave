import { Texture, useClick, useMobilePlatform, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import type { WorldScene } from '~game/scenes/world';
import { GameScene } from '~game/types';
import { Cost } from '~scene/system/interface/cost';
import { BUILDINGS } from '~scene/world/entities/building/factory/const';
import type { BuildingVariant } from '~scene/world/entities/building/types';

import { Container, Number, Image, Info, Frame } from './styles';

type Props = {
  number: number
  variant: BuildingVariant
  isGlowing?: boolean
};

export const Preview: React.FC<Props> = ({ number, variant }) => {
  const world = useScene<WorldScene>(GameScene.WORLD);

  const isMobile = useMobilePlatform();

  const refContainer = useRef<HTMLDivElement>(null);

  const [isAllow, setAllow] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isUsable, setUsable] = useState(false);

  useClick(refContainer, 'down', () => {
    if (world.builder.variant === variant) {
      world.builder.unsetBuildingVariant();
    } else {
      world.builder.setBuildingVariant(variant);
    }
  }, [variant]);

  useSceneUpdate(world, () => {
    const currentIsActive = world.builder.variant === variant;
    const currentIsAllow = (
      world.builder.isBuildingAllowByWave(variant)
      && world.builder.isBuildingAllowByTutorial(variant)
    );
    const currentIsUsable = (
      world.player.resources >= BUILDINGS[variant].Cost
      && !world.builder.isBuildingLimitReached(variant)
    );

    setActive(currentIsActive);
    setAllow(currentIsAllow);
    setUsable(currentIsUsable);
  }, []);

  return (
    <Container
      ref={refContainer}
      $allow={isAllow}
      $active={isActive}
      $usable={isUsable}
    >
      {!isMobile && (
        <Number>{number}</Number>
      )}
      <Image>
        <Frame>
          <Texture name={BUILDINGS[variant].Texture} />
        </Frame>
      </Image>
      <Info>
        <Cost type="RESOURCES" value={BUILDINGS[variant].Cost} check={isAllow} />
      </Info>
    </Container>
  );
};
