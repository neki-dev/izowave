import cn from 'classnames';
import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { ComponentAmount } from '~scene/basic/interface/amount';
import { ComponentBuildingParameters } from '~scene/basic/interface/building-parameters';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';

import {
  Allowance,
  Cost,
  Description,
  Header,
  Limit,
  Name,
  Wrapper,
} from './styles';

type Props = {
  variant: BuildingVariant
};

export const ComponentBuilderInfo: React.FC<Props> = ({ variant }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [limit, setLimit] = useState(0);
  const [existCount, setExistCount] = useState(0);
  const [isAllowByWave, setAllowByWave] = useState(false);
  const [isAllowByTutorial, setAllowByTutorial] = useState(false);

  useSceneUpdate(world, () => {
    const currentIsAllowByWave = world.builder.isBuildingAllowByWave(variant);
    const currentIsAllowByTutorial = world.builder.isBuildingAllowByTutorial(variant);

    setAllowByWave(currentIsAllowByWave);
    setAllowByTutorial(currentIsAllowByTutorial);

    if (currentIsAllowByWave && currentIsAllowByTutorial) {
      const currentLimit = world.builder.getBuildingLimit(variant);

      setLimit(currentLimit);
      if (currentLimit) {
        setExistCount(world.getBuildingsByVariant(variant).length);
      }
    }
  });

  return (
    <Wrapper>
      <Header>
        <Name>{BUILDINGS[variant].Name}</Name>
        {isAllowByWave && isAllowByTutorial && limit && (
          <Limit
            className={cn({
              attention: existCount >= limit,
            })}
          >
            {existCount}/{limit}
          </Limit>
        )}
      </Header>
      <Description>{BUILDINGS[variant].Description}</Description>

      {!isAllowByWave && (
        <Allowance>
          Available from {BUILDINGS[variant].AllowByWave} wave
        </Allowance>
      )}

      {isAllowByWave && isAllowByTutorial && (
        <>
          <ComponentBuildingParameters params={BUILDINGS[variant].Params} />
          <Cost>
            <ComponentAmount
              type="resources"
              label="BUILDING COST"
              value={BUILDINGS[variant].Cost}
            />
          </Cost>
        </>
      )}
    </Wrapper>
  );
};

ComponentBuilderInfo.displayName = 'ComponentBuilderInfo';
