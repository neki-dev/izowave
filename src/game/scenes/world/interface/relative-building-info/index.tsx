import { RelativePosition, useMatchMedia, useScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { BuildingInfo } from '~scene/system/interface/building-info';
import { GameScene } from '~type/game';
import { IWorld, WorldEvents } from '~type/world';
import { IBuilding } from '~type/world/entities/building';

export const RelativeBuildingInfo: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const isSmallScreen = useMatchMedia(INTERFACE_MOBILE_BREAKPOINT);

  const [building, setBuilding] = useState<Nullable<IBuilding>>(null);

  const onSelect = (target: IBuilding) => {
    setBuilding(target);
  };

  const onUnselect = () => {
    setBuilding(null);
  };

  useEffect(() => {
    world.events.on(WorldEvents.SELECT_BUILDING, onSelect);
    world.events.on(WorldEvents.UNSELECT_BUILDING, onUnselect);

    return () => {
      world.events.off(WorldEvents.SELECT_BUILDING, onSelect);
      world.events.off(WorldEvents.UNSELECT_BUILDING, onUnselect);
    };
  }, []);

  return (
    building && (isSmallScreen ? (
      <BuildingInfo building={building} />
    ) : (
      <RelativePosition x={building.x} y={building.y}>
        <BuildingInfo building={building} />
      </RelativePosition>
    ))
  );
};
