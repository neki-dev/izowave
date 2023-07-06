import cn from 'classnames';
import React, { useContext, useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { GameContext, useWorldUpdate } from '~lib/interface';
import { ComponentAmount } from '~scene/basic/interface/amount';
import { ComponentBuildingParameters } from '~scene/basic/interface/building-parameters';
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
  const game = useContext(GameContext);

  const [limit, setLimit] = useState(0);
  const [existCount, setExistCount] = useState(0);
  const [isAllowByWave, setAllowByWave] = useState(false);
  const [isAllowByTutorial, setAllowByTutorial] = useState(false);

  useWorldUpdate(() => {
    const currentIsAllowByWave = game.world.builder.isBuildingAllowByWave(variant);
    const currentIsAllowByTutorial = game.world.builder.isBuildingAllowByTutorial(variant);

    setAllowByWave(currentIsAllowByWave);
    setAllowByTutorial(currentIsAllowByTutorial);

    if (currentIsAllowByWave && currentIsAllowByTutorial) {
      const currentLimit = game.world.builder.getBuildingLimit(variant);

      setLimit(currentLimit);
      if (currentLimit) {
        setExistCount(game.world.getBuildingsByVariant(variant).length);
      }
    }
  });

  return (
    <Wrapper>
      <Header>
        <Name>{BUILDINGS[variant].Name}</Name>
        {isAllowByWave && isAllowByTutorial && limit && (
          <Limit className={cn({
            attention: existCount >= limit,
          })}>
            {existCount}/{limit}
          </Limit>
        )}
      </Header>
      <Description>{BUILDINGS[variant].Description}</Description>

      {!isAllowByWave && (
        <Allowance>
          Will be available on {BUILDINGS[variant].AllowByWave} wave
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
