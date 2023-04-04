import cn from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { Building } from '~entity/building';
import { GameContext, useWorldUpdate } from '~lib/ui';
import { WorldEvents } from '~type/world';
// import { Vector2D } from '~type/world/level';
import { BuildingAction, BuildingParamItem } from '~type/world/entities/building';

import {
  Action,
  Actions,
  Name,
  Parameter,
  Parameters,
  UpgradeLevel,
  Wrapper,
} from './styles';

export const ComponentBuildingInfo: React.FC = () => {
  const game = useContext(GameContext);

  const [building, setBuilding] = useState<Building>(null);
  const [upgradeLevel, setUpgradeLevel] = useState(1);
  const [params, setParams] = useState<BuildingParamItem[]>([]);
  const [actions, setActions] = useState<BuildingAction[]>([]);
  // const [position, setPosition] = useState<Vector2D>({ x: 0, y: 0 });

  const refBuilding = useRef<Building>(null);
  const refWrapper = useRef<HTMLDivElement>(null);

  const onSelect = (target: Building) => {
    refBuilding.current = target;
    setBuilding(target);
  };

  const onUnselect = () => {
    refBuilding.current = null;
    setBuilding(null);
  };

  useWorldUpdate(() => {
    if (!refBuilding.current) {
      return;
    }

    setUpgradeLevel(refBuilding.current.upgradeLevel);
    setParams((currentParams) => {
      const newParams = refBuilding.current.getInfo();

      if (currentParams.length !== newParams.length) {
        return newParams;
      }

      for (let i = 0; i < currentParams.length; i++) {
        if (
          currentParams[i].value !== newParams[i].value
          || currentParams[i].attention !== newParams[i].attention
        ) {
          return newParams;
        }
      }

      return currentParams;
    });
    setActions((currentActions) => {
      const newActions = refBuilding.current.getActions();

      return (currentActions.length === newActions.length) ? currentActions : newActions;
    });

    if (refWrapper.current) {
      const camera = game.world.cameras.main;
      const x = Math.round((refBuilding.current.x - camera.worldView.x) * camera.zoom);
      const y = Math.round((refBuilding.current.y - camera.worldView.y) * camera.zoom);

      refWrapper.current.style.left = `${x}px`;
      refWrapper.current.style.top = `${y}px`;
    }

    // setPosition((currentPosition) => {
    //   const camera = game.world.cameras.main;
    //   const x = Math.round((building.x - camera.worldView.x) * camera.zoom);
    //   const y = Math.round((building.y - camera.worldView.y) * camera.zoom);

    //   return (currentPosition.x === x && currentPosition.y === y) ? currentPosition : { x, y };
    // });
  });

  useEffect(() => {
    game.world.events.on(WorldEvents.SELECT_BUILDING, onSelect);
    game.world.events.on(WorldEvents.UNSELECT_BUILDING, onUnselect);

    return () => {
      game.world.events.off(WorldEvents.SELECT_BUILDING, onSelect);
      game.world.events.off(WorldEvents.UNSELECT_BUILDING, onUnselect);
    };
  }, []);

  return building && (
    <Wrapper ref={refWrapper}>
      <Name>{building.getMeta().Name}</Name>

      <UpgradeLevel>
        {Array.from({ length: BUILDING_MAX_UPGRADE_LEVEL }).map((_, level) => (
          <UpgradeLevel.Item key={level} className={cn({ active: level < upgradeLevel })} />
        ))}
      </UpgradeLevel>

      <Parameters>
        {params.map((param) => (
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

      <Actions>
        {actions.map((action) => (
          <Action key={action.label} onClick={action.onClick}>
            {action.label}
          </Action>
        ))}
      </Actions>
    </Wrapper>
  );
};

ComponentBuildingInfo.displayName = 'ComponentBuildingInfo';
