import React, { useEffect, useMemo, useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { Tutorial } from '~lib/tutorial';
import { eachEntries } from '~lib/utils';
import { TutorialStep } from '~type/tutorial';
import { BuildingVariant } from '~type/world/entities/building';

import { Building } from './building';
import {
  Category, Label, Variants, Wrapper,
} from './styles';

export const Builder: React.FC = () => {
  const [hint, setHint] = useState<Nullable<{
    variant: BuildingVariant
    text: string
  }>>(null);

  const categories = useMemo(() => {
    const result: Record<string, {
      number: number
      variant: BuildingVariant
    }[]> = {};

    eachEntries(BUILDINGS, (variant, building, index) => {
      if (!result[building.Category]) {
        result[building.Category] = [];
      }
      result[building.Category].push({
        number: index + 1,
        variant,
      });
    });

    return Object.entries(result).map(([label, buildings]) => ({
      label,
      buildings,
    }));
  }, []);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.BUILD_GENERATOR: {
        return setHint({
          variant: BuildingVariant.GENERATOR,
          text: 'Build generator\nto get resources',
        });
      }
      case TutorialStep.BUILD_GENERATOR_SECOND: {
        return setHint({
          variant: BuildingVariant.GENERATOR,
          text: 'Build second generator\nto get more resources',
        });
      }
      case TutorialStep.BUILD_RADAR: {
        return setHint({
          variant: BuildingVariant.RADAR,
          text: 'Build radar\nto uncover enemies',
        });
      }
      case TutorialStep.BUILD_TOWER_FIRE: {
        return setHint({
          variant: BuildingVariant.TOWER_FIRE,
          text: 'Build tower\nto attack enemies',
        });
      }
      case TutorialStep.BUILD_AMMUNITION: {
        return setHint({
          variant: BuildingVariant.AMMUNITION,
          text: 'Build ammunition\nto reload towers',
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
        <Category key={category.label}>
          <Label>{category.label}</Label>
          <Variants>
            {category.buildings.map((building) => (
              <Building
                key={building.variant}
                variant={building.variant}
                number={building.number}
                hint={hint?.variant === building.variant ? hint.text : undefined}
              />
            ))}
          </Variants>
        </Category>
      ))}
    </Wrapper>
  );
};
