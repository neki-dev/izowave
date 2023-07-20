import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';

import {
  Container, Number, Preview, Image,
} from './styles';

type Props = {
  number: number
  variant: BuildingVariant
};

export const BuilderPreview: React.FC<Props> = ({
  number,
  variant,
}) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isDisallow, setDisallow] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isUsed, setUsed] = useState(false);

  const isNewest = !isUsed && !isDisallow && !isDisabled;

  const selectBuilding = () => {
    if (isDisallow) {
      return;
    }

    if (world.builder.variant === variant) {
      world.builder.unsetBuildingVariant();
    } else {
      world.builder.setBuildingVariant(variant);
    }
  };

  const onHover = () => {
    if (!isDisallow && !isDisabled) {
      setUsed(true);
    }
  };

  useSceneUpdate(world, () => {
    const currentIsActive = world.builder.variant === variant;

    setActive(currentIsActive);
    if (currentIsActive) {
      setUsed(true);
    }
    setDisallow(!world.builder.isBuildingAllowByWave(variant));
    setDisabled(!world.builder.isBuildingAllowByTutorial(variant));
  });

  return (
    <Container
      onClick={selectBuilding}
      onMouseEnter={onHover}
      $disallow={isDisallow}
      $disabled={isDisabled}
      $active={isActive}
      $newest={isNewest}
    >
      <Number>{number}</Number>
      <Preview>
        <Image src={`assets/sprites/${BUILDINGS[variant].Texture}.png`} />
      </Preview>
    </Container>
  );
};
