import cn from 'classnames';
import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';

import { Building } from './styles';

type Props = {
  number: number
  variant: BuildingVariant
};

export const ComponentBuilderPreview: React.FC<Props> = ({
  number,
  variant,
}) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isDisallow, setDisallow] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isUsed, setUsed] = useState(false);

  const isNewest = !isUsed && !isDisallow;

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

  useSceneUpdate(world, () => {
    const currentIsActive = world.builder.variant === variant;

    setActive(currentIsActive);
    if (currentIsActive) {
      setUsed(true);
    }
    setDisallow(
      !world.builder.isBuildingAllowByTutorial(variant)
      || !world.builder.isBuildingAllowByWave(variant),
    );
  });

  return (
    <Building
      onClick={selectBuilding}
      onMouseEnter={() => setUsed(true)}
      className={cn({
        disallow: isDisallow,
        active: isActive,
        newest: isNewest,
      })}
    >
      <Building.Number>{number}</Building.Number>
      <Building.Preview>
        <img src={`assets/sprites/${BUILDINGS[variant].Texture}.png`} />
      </Building.Preview>
    </Building>
  );
};

ComponentBuilderPreview.displayName = 'ComponentBuilderPreview';
