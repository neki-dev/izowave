import { useGame } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { Hint } from '~scene/system/interface/hint';
import { IGame } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { BuildingVariant } from '~type/world/entities/building';

import { BuilderInfo } from './info';
import { BuilderPreview } from './preview';
import { Variant, Info, Wrapper } from './styles';

export const Builder: React.FC = () => {
  const game = useGame<IGame>();

  const [hint, setHint] = useState<Nullable<{
    variant: BuildingVariant
    text: string
  }>>(null);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.BUILD_GENERATOR: {
        return setHint({
          variant: BuildingVariant.GENERATOR,
          text: 'Build generator\nto get resources',
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
      case TutorialStep.BUILD_RADAR:
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
            <Hint side="right">{hint.text}</Hint>
          )}

          <Info>
            <BuilderInfo variant={variant} />
          </Info>

          <BuilderPreview variant={variant} number={index + 1} />
        </Variant>
      ))}
    </Wrapper>
  );
};
