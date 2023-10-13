import React, { useEffect, useMemo, useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { mapEntries } from '~lib/utils';
import { LangPhrase } from '~type/lang';
import { TutorialStep } from '~type/tutorial';
import { BuildingCategory, BuildingVariant } from '~type/world/entities/building';

import { Building } from './building';
import {
  Category, Label, Variants, Wrapper,
} from './styles';

export const Builder: React.FC = () => {
  const [hint, setHint] = useState<Nullable<{
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

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.BUILD_GENERATOR: {
        return setHint({
          variant: BuildingVariant.GENERATOR,
          label: 'TUTORIAL_BUILD_GENERATOR',
        });
      }
      case TutorialStep.BUILD_GENERATOR_SECOND: {
        return setHint({
          variant: BuildingVariant.GENERATOR,
          label: 'TUTORIAL_BUILD_GENERATOR_SECOND',
        });
      }
      case TutorialStep.BUILD_RADAR: {
        return setHint({
          variant: BuildingVariant.RADAR,
          label: 'TUTORIAL_BUILD_RADAR',
        });
      }
      case TutorialStep.BUILD_TOWER_FIRE: {
        return setHint({
          variant: BuildingVariant.TOWER_FIRE,
          label: 'TUTORIAL_BUILD_TOWER_FIRE',
        });
      }
      case TutorialStep.BUILD_AMMUNITION: {
        return setHint({
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
        return setHint(null);
      }
    }
  };

  useEffect(() => Tutorial.BindAll({
    beg: showHint,
    end: hideHint,
  }), []);

  return (
    <Wrapper>
      {categories.map((category) => (
        <Category key={category.type}>
          <Label>{phrase(`BUILDING_CATEGORY_${category.type}`)}</Label>
          <Variants>
            {category.buildings.map((building) => (
              <Building
                key={building.variant}
                variant={building.variant}
                number={building.number}
                hint={hint?.variant === building.variant ? hint.label : undefined}
              />
            ))}
          </Variants>
        </Category>
      ))}
    </Wrapper>
  );
};
