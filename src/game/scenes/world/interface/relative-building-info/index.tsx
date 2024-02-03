import {
  RelativePosition, RelativeScale, useMatchMedia, useScene,
} from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { GameScene } from '../../../../types';
import { INTERFACE_MOBILE_BREAKPOINT, INTERFACE_SCALE } from '~lib/interface/const';
import { BuildingInfo } from '~scene/system/interface/building-info';
import { IBuilding } from '~scene/world/entities/building/types';
import { IWorld, WorldEvents } from '~scene/world/types';

import { TranslateToScreen } from './translate-to-screen';

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
      <TranslateToScreen building={building} />
    ) : (
      <RelativePosition x={building.x} y={building.getTopEdgePosition().y}>
        <RelativeScale {...INTERFACE_SCALE}>
          <BuildingInfo building={building} />
        </RelativeScale>
      </RelativePosition>
    ))
  );
};
