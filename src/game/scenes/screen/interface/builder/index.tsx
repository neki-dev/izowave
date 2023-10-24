import {
  RelativePosition, RelativeScale, useGame, useScene, useSceneUpdate,
} from 'phaser-react-ui';
import React, { useEffect, useMemo, useState } from 'react';

import { INTERFACE_SCALE } from '~const/interface';
import { BUILDINGS } from '~const/world/entities/buildings';
import { isPositionsEqual } from '~lib/dimension';
import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { mapEntries } from '~lib/utils';
import { Hint } from '~scene/system/interface/hint';
import { Level } from '~scene/world/level';
import { GameScene, IGame } from '~type/game';
import { LangPhrase } from '~type/lang';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import { BuildingCategory, BuildingVariant } from '~type/world/entities/building';
import { PositionAtWorld } from '~type/world/level';

import { Building } from './building';
import {
  Category, Label, HintTranslator, Variants, Wrapper,
} from './styles';

export const Builder: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isHidden, setHidden] = useState(false);
  const [hintStopBuild, setHintStopBuild] = useState<Nullable<PositionAtWorld>>(null);
  const [hintBuilding, setHintBuilding] = useState<Nullable<{
    variant: BuildingVariant
    label: LangPhrase
  }>>(null);

  const categories = useMemo(() => {
    const buildings = mapEntries(BUILDINGS, (variant, building, index) => ({
      variant,
      category: building.Category,
      number: index + 1,
    }));

    return Object.values(BuildingCategory).map((type) => ({
      type,
      buildings: buildings.filter((building) => building.category === type),
    }));
  }, []);

  const getSupposedPosition = () => {
    if (world.builder.supposedPosition) {
      return Level.ToWorldPosition(world.builder.supposedPosition);
    }

    return null;
  };

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.BUILD_GENERATOR: {
        return setHintBuilding({
          variant: BuildingVariant.GENERATOR,
          label: 'TUTORIAL_BUILD_GENERATOR',
        });
      }
      case TutorialStep.BUILD_GENERATOR_SECOND: {
        return setHintBuilding({
          variant: BuildingVariant.GENERATOR,
          label: 'TUTORIAL_BUILD_GENERATOR_SECOND',
        });
      }
      case TutorialStep.BUILD_RADAR: {
        return setHintBuilding({
          variant: BuildingVariant.RADAR,
          label: 'TUTORIAL_BUILD_RADAR',
        });
      }
      case TutorialStep.BUILD_TOWER_FIRE: {
        return setHintBuilding({
          variant: BuildingVariant.TOWER_FIRE,
          label: 'TUTORIAL_BUILD_TOWER_FIRE',
        });
      }
      case TutorialStep.BUILD_AMMUNITION: {
        return setHintBuilding({
          variant: BuildingVariant.AMMUNITION,
          label: 'TUTORIAL_BUILD_AMMUNITION',
        });
      }
      case TutorialStep.STOP_BUILD: {
        return setHintStopBuild(getSupposedPosition());
      }
    }
  };

  const hideHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.BUILD_GENERATOR:
      case TutorialStep.BUILD_GENERATOR_SECOND:
      case TutorialStep.BUILD_RADAR:
      case TutorialStep.BUILD_TOWER_FIRE:
      case TutorialStep.BUILD_AMMUNITION: {
        return setHintBuilding(null);
      }
      case TutorialStep.STOP_BUILD: {
        return setHintStopBuild(null);
      }
    }
  };

  useEffect(() => Tutorial.BindAll({
    beg: showHint,
    end: hideHint,
  }), []);

  useSceneUpdate(world, () => {
    setHidden(
      Boolean(world.builder.selectedBuilding)
      && !game.isDesktop(),
    );

    if (hintStopBuild) {
      const position = getSupposedPosition();

      if (position && !isPositionsEqual(hintStopBuild, position)) {
        setHintStopBuild(position);
      }
    }
  }, [hintStopBuild]);

  return (
    <Wrapper $hidden={isHidden}>
      {categories.map((category) => (
        <Category key={category.type}>
          <Label>{phrase(`BUILDING_CATEGORY_${category.type}`)}</Label>
          <Variants>
            {category.buildings.map((building) => (
              <Building
                key={building.variant}
                variant={building.variant}
                number={building.number}
                hint={hintBuilding?.variant === building.variant ? hintBuilding.label : undefined}
              />
            ))}
          </Variants>
        </Category>
      ))}

      {hintStopBuild && (
        <HintTranslator>
          <RelativePosition x={hintStopBuild.x} y={hintStopBuild.y} camera={world.cameras.main}>
            <RelativeScale {...INTERFACE_SCALE}>
              <Hint label='TUTORIAL_STOP_BUILD' side="top" align="center" />
            </RelativeScale>
          </RelativePosition>
        </HintTranslator>
      )}
    </Wrapper>
  );
};
