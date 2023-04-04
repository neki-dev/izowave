import React, { useContext, useEffect, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/ui';
import { TutorialStep } from '~type/tutorial';
import { BuildingVariant } from '~type/world/entities/building';

import { ComponentHint } from '../hint';
import { ComponentBuildingInfo } from './building-info';
import { ComponentBuildingPreview } from './building-preview';
import { Variant, Info, Wrapper } from './styles';

export const ComponentBuilder: React.FC = () => {
  const game = useContext(GameContext);

  const [isWaveGoing, setWaveGoing] = useState(game.world.wave.isGoing);
  const [hint, setHint] = useState<{
    variant: BuildingVariant
    text: string
  }>(null);

  useWorldUpdate(() => {
    setWaveGoing(game.world.wave.isGoing);
  });

  useEffect(() => {
    game.tutorial.onBegAny((step: TutorialStep) => {
      switch (step) {
        case TutorialStep.BUILD_GENERATOR: {
          setHint({
            variant: BuildingVariant.GENERATOR,
            text: 'Build generator to get resources',
          });
          break;
        }
        case TutorialStep.BUILD_TOWER_FIRE: {
          setHint({
            variant: BuildingVariant.TOWER_FIRE,
            text: 'Build tower to defend yourself from enemies',
          });
          break;
        }
        case TutorialStep.BUILD_AMMUNITION: {
          setHint({
            variant: BuildingVariant.AMMUNITION,
            text: 'Build ammunition to reload tower ammo',
          });
          break;
        }
        default: break;
      }
    });
    game.tutorial.onEndAny(() => {
      setHint(null);
    });
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
              <ComponentBuildingInfo variant={variant} />
            </Info>
          )}

          <ComponentBuildingPreview
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
