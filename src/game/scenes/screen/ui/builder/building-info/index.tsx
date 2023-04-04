import cn from 'classnames';
import React, { useContext, useState } from 'react';

import { BUILDINGS } from '~const/world/entities/buildings';
import { GameContext, useWorldUpdate } from '~lib/ui';
import { ScreenTexture } from '~type/screen';
import { BuildingVariant } from '~type/world/entities/building';

import {
  Cost,
  Description,
  Header,
  Limit,
  Name,
  Parameter,
  Parameters,
  Wrapper,
} from './styles';

type Props = {
  variant: BuildingVariant
};

export const ComponentBuildingInfo: React.FC<Props> = ({ variant }) => {
  const game = useContext(GameContext);

  const [playerResources, setPlayerResources] = useState(0);
  const [limit, setLimit] = useState(0);
  const [existCount, setExistCount] = useState(0);
  const [isAllow, setAllow] = useState(false);

  useWorldUpdate(() => {
    const currentIsAllow = game.world.builder.isBuildingAllowedByTutorial(variant)
      && game.world.builder.isBuildingAllowedByWave(variant);

    setAllow(currentIsAllow);

    if (currentIsAllow) {
      const currentLimit = game.world.builder.getBuildingLimit(variant);

      setLimit(currentLimit);
      if (currentLimit) {
        setExistCount(game.world.getBuildingsByVariant(variant).length);
      }

      setPlayerResources(game.world.player.resources);
    }
  });

  return (
    <Wrapper>
      <Header>
        <Name>{BUILDINGS[variant].Name}</Name>
        {(isAllow && limit) && (
          <Limit>
            {existCount}/{limit}
          </Limit>
        )}
      </Header>
      <Description>{BUILDINGS[variant].Description}</Description>

      {isAllow && (
        <>
          <Parameters>
            {BUILDINGS[variant].Params.map((param) => (
              <Parameter key={param.label}>
                <Parameter.IconWrapper>
                  <Parameter.Icon
                    style={{ backgroundPositionX: `${-10 * param.icon}px` }}
                  />
                </Parameter.IconWrapper>
                <Parameter.Info className={cn({ attention: param.attention })}>
                  <Parameter.Label>{param.label}</Parameter.Label>
                  <Parameter.Value>{param.value}</Parameter.Value>
                </Parameter.Info>
              </Parameter>
            ))}
          </Parameters>

          <Cost>
            BUILDING COST
            <Cost.Icon src={`assets/sprites/${ScreenTexture.RESOURCES}.png`} />
            <Cost.Value
              className={cn({
                attention: playerResources < BUILDINGS[variant].Cost,
              })}
            >
              {BUILDINGS[variant].Cost}
            </Cost.Value>
          </Cost>
        </>
      )}
    </Wrapper>
  );
};

ComponentBuildingInfo.displayName = 'ComponentBuildingInfo';
