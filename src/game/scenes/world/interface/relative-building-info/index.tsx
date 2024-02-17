import {
  RelativePosition, RelativeScale, useMatchMedia, useScene,
} from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { GameScene } from '../../../../types';

import { TranslateToScreen } from './translate-to-screen';

import type { IBuilding } from '~scene/world/entities/building/types';
import type { IWorld } from '~scene/world/types';

import { INTERFACE_MOBILE_BREAKPOINT, INTERFACE_SCALE } from '~lib/interface/const';
import { BuildingInfo } from '~scene/system/interface/building-info';
import { WorldEvent } from '~scene/world/types';

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
    world.events.on(WorldEvent.SELECT_BUILDING, onSelect);
    world.events.on(WorldEvent.UNSELECT_BUILDING, onUnselect);

    return () => {
      world.events.off(WorldEvent.SELECT_BUILDING, onSelect);
      world.events.off(WorldEvent.UNSELECT_BUILDING, onUnselect);
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
