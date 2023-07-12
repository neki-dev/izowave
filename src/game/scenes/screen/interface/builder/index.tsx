import { useGame } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { ComponentHint } from '~scene/basic/interface/hint';
import { IGame } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { BuildingVariant } from '~type/world/entities/building';

import { ComponentBuilderInfo } from './info';
import { ComponentBuilderPreview } from './preview';
import { Variant, Info, Wrapper } from './styles';

export const ComponentBuilder: React.FC = () => {
  const game = useGame<IGame>();

  const [hint, setHint] = useState<{
    variant: BuildingVariant
    text: string
  }>(null);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.BUILD_GENERATOR: {
        return setHint({
          variant: BuildingVariant.GENERATOR,
          text: 'Build generator to get resources',
        });
      }
      case TutorialStep.BUILD_TOWER_FIRE: {
        return setHint({
          variant: BuildingVariant.TOWER_FIRE,
          text: 'Build tower to defend yourself from enemies',
        });
      }
      case TutorialStep.BUILD_AMMUNITION: {
        return setHint({
          variant: BuildingVariant.AMMUNITION,
          text: 'Build ammunition to reload tower ammo',
        });
      }
    }
  };

  const hideHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.BUILD_GENERATOR:
      case TutorialStep.BUILD_TOWER_FIRE:
      case TutorialStep.BUILD_AMMUNITION: {
        return setHint(null);
      }
    }
  };

  useEffect(
    () => game.tutorial.bindAll({
      beg: showHint,
      end: hideHint,
    }),
    [],
  );

  return (
    <Wrapper>
      {Object.values(BuildingVariant).map((variant, index) => (
        <Variant key={variant}>
          {hint?.variant === variant && (
            <ComponentHint side="right">{hint.text}</ComponentHint>
          )}

          <Info>
            <ComponentBuilderInfo variant={variant} />
          </Info>

          <ComponentBuilderPreview variant={variant} number={index + 1} />
        </Variant>
      ))}
    </Wrapper>
  );
};

ComponentBuilder.displayName = 'ComponentBuilder';
