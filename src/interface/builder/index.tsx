import React, { useContext, useEffect, useState } from 'react';

import { ComponentBuilderInfo } from '~interface/builder/info';
import { ComponentBuilderPreview } from '~interface/builder/preview';
import { ComponentHint } from '~interface/plates/hint';
import { GameContext, useWorldUpdate } from '~lib/interface';
import { TutorialStep } from '~type/tutorial';
import { BuildingVariant } from '~type/world/entities/building';

import { Variant, Info, Wrapper } from './styles';

export const ComponentBuilder: React.FC = () => {
  const game = useContext(GameContext);

  const [isWaveGoing, setWaveGoing] = useState(false);
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
      default: break;
    }
  };

  const hideHint = () => {
    setHint(null);
  };

  useEffect(() => game.tutorial.bindAll({
    beg: showHint,
    end: hideHint,
  }), []);

  useWorldUpdate(() => {
    setWaveGoing(game.world.wave.isGoing);
  });

  return (
    <Wrapper>
      {Object.values(BuildingVariant).map((variant, index) => (
        <Variant key={variant}>
          {(hint && hint.variant === variant) && (
            <ComponentHint side="right">
              {hint.text}
            </ComponentHint>
          )}

          {!isWaveGoing && (
            <Info>
              <ComponentBuilderInfo variant={variant} />
            </Info>
          )}

          <ComponentBuilderPreview
            variant={variant}
            number={index + 1}
            isDisabled={isWaveGoing}
          />
        </Variant>
      ))}
    </Wrapper>
  );
};

ComponentBuilder.displayName = 'ComponentBuilder';
