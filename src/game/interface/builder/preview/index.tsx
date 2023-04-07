import cn from 'classnames';
import React, { useContext, useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { GameContext, useWorldUpdate } from '~lib/interface';
import { BuildingVariant } from '~type/world/entities/building';

import { Building } from './styles';

type Props = {
  number: number
  variant: BuildingVariant
  isDisabled?: boolean
};

export const ComponentBuilderPreview: React.FC<Props> = ({
  number,
  variant,
  isDisabled,
}) => {
  const game = useContext(GameContext);

  const [isDisallow, setDisallow] = useState(false);
  const [isActive, setActive] = useState(false);

  const selectBuilding = () => {
    if (isDisabled || isDisallow) {
      return;
    }

    if (game.world.builder.variant === variant) {
      game.world.builder.unsetBuildingVariant();
    } else {
      game.world.builder.setBuildingVariant(variant);
    }
  };

  useWorldUpdate(() => {
    setActive(game.world.builder.variant === variant);
    setDisallow(
      !game.world.builder.isBuildingAllowByTutorial(variant)
      || !game.world.builder.isBuildingAllowByWave(variant),
    );
  });

  return (
    <Building
      onClick={selectBuilding}
      className={cn({
        disabled: isDisabled,
        disallow: isDisallow,
        active: isActive,
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
