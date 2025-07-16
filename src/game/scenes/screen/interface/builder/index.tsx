import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useEffect, useMemo, useState } from 'react';

import { Building } from './building';

import { phrase } from '~core/lang';
import type { LangPhrase } from '~core/lang/types';
import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import { Utils } from '~core/utils';
import type { Game } from '~game/index';
import type { WorldScene } from '~game/scenes/world';
import { GameScene } from '~game/types';
import { BUILDINGS } from '~scene/world/entities/building/factory/const';
import { BuildingVariant, BuildingCategory } from '~scene/world/entities/building/types';

import { Category, Label, Variants, Wrapper } from './styles';

export const Builder: React.FC = () => {
  const game = useGame<Game>();
  const world = useScene<WorldScene>(GameScene.WORLD);

  const [isHidden, setHidden] = useState(false);
  const [hintBuilding, setHintBuilding] = useState<Nullable<{
    variant: BuildingVariant
    label: LangPhrase
  }>>(null);

  const categories = useMemo(() => {
    const buildings = Utils.MapObject(BUILDINGS, (variant, building, index) => ({
      variant,
      category: building.Category,
      number: index + 1,
    }));

    return Object.values(BuildingCategory).map((type) => ({
      type,
      buildings: buildings.filter((building) => building.category === type),
    }));
  }, []);

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
  }, []);

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
                hint={
                  (hintBuilding && hintBuilding.variant === building.variant)
                    ? hintBuilding.label
                    : undefined
                }
              />
            ))}
          </Variants>
        </Category>
      ))}
    </Wrapper>
  );
};
