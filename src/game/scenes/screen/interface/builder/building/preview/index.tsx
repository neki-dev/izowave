import {
  Texture, useMobilePlatform, useScene, useSceneUpdate,
} from 'phaser-react-ui';
import React, { useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { Cost } from '~scene/system/interface/cost';
import { Builder } from '~scene/world/builder';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';

import {
  Container, Number, Preview, Newest, Info, Frame,
} from './styles';

type Props = {
  number: number
  variant: BuildingVariant
};

export const BuilderPreview: React.FC<Props> = ({ number, variant }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const isMobile = useMobilePlatform();

  const [isAllow, setAllow] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isUsed, setUsed] = useState(false);
  const [isUsable, setUsable] = useState(false);

  const isNewest = !isUsed && isAllow && !world.game.usedSave;

  const onClick = () => {
    if (world.builder.variant === variant) {
      world.builder.unsetBuildingVariant();
    } else {
      world.builder.setBuildingVariant(variant);
    }
  };

  const onMouseEnter = () => {
    if (isAllow) {
      setUsed(true);
    }
  };

  useSceneUpdate(world, () => {
    const currentIsActive = world.builder.variant === variant;
    const currentIsAllow = (
      world.builder.isBuildingAllowByWave(variant)
      && Builder.IsBuildingAllowByTutorial(variant)
    );
    const currentIsUsable = (
      world.player.resources >= BUILDINGS[variant].Cost
      && !world.builder.isBuildingLimitReached(variant)
    );

    setActive(currentIsActive);
    setAllow(currentIsAllow);
    setUsable(currentIsUsable);
    if (currentIsActive) {
      setUsed(true);
    }
  }, []);

  return (
    <Container
      {...isMobile ? {
        onTouchEnd: onClick,
      } : {
        onClick,
        onMouseEnter,
      }}
      $allow={isAllow}
      $active={isActive}
      $usable={isUsable}
    >
      {isNewest && (
        <Newest>new</Newest>
      )}
      {!isMobile && (
        <Number>{number}</Number>
      )}
      <Preview>
        <Frame>
          <Texture name={BUILDINGS[variant].Texture} frame={0} />
        </Frame>
      </Preview>
      <Info>
        <Cost type="resources" value={BUILDINGS[variant].Cost} size="small" />
      </Info>
    </Container>
  );
};
