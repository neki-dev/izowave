import cn from 'classnames';
import { getModifiedArray, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { ComponentBuildingParameters } from '~scene/basic/interface/building-parameters';
import { GameScene } from '~type/game';
import { IWorld, WorldEvents } from '~type/world';
import {
  BuildingControl,
  BuildingParam,
  IBuilding,
} from '~type/world/entities/building';

import { ComponentBuildingControls } from './controls';
import { Name, UpgradeLevel, Wrapper } from './styles';

export const ComponentBuildingInfo: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [building, setBuilding] = useState<IBuilding>(null);
  const [upgradeLevel, setUpgradeLevel] = useState(1);
  const [params, setParams] = useState<BuildingParam[]>([]);
  const [controls, setControls] = useState<BuildingControl[]>([]);

  const refWrapper = useRef<HTMLDivElement>(null);

  const onSelect = (target: IBuilding) => {
    setBuilding(target);
  };

  const onUnselect = () => {
    setBuilding(null);
    setParams([]);
    setControls([]);
  };

  useEffect(() => {
    world.events.on(WorldEvents.SELECT_BUILDING, onSelect);
    world.events.on(WorldEvents.UNSELECT_BUILDING, onUnselect);

    return () => {
      world.events.off(WorldEvents.SELECT_BUILDING, onSelect);
      world.events.off(WorldEvents.UNSELECT_BUILDING, onUnselect);
    };
  }, []);

  useSceneUpdate(world, () => {
    if (!building) {
      return;
    }

    setUpgradeLevel(building.upgradeLevel);
    setParams((current) => getModifiedArray(current, building.getInfo(), ['value', 'attention']));
    setControls((current) => getModifiedArray(current, building.getControls(), ['label', 'cost']));

    if (refWrapper.current) {
      const camera = world.cameras.main;
      const x = Math.round((building.x - camera.worldView.x) * camera.zoom);
      const y = Math.round((building.y - camera.worldView.y) * camera.zoom);

      refWrapper.current.style.left = `${x}px`;
      refWrapper.current.style.top = `${y}px`;
    }
  }, [building]);

  return (
    building && (
      <Wrapper ref={refWrapper}>
        <Name>{building.getMeta().Name}</Name>

        <UpgradeLevel>
          {Array.from({ length: BUILDING_MAX_UPGRADE_LEVEL }).map(
            (_, level) => (
              <UpgradeLevel.Item
                key={level}
                className={cn({ active: level < upgradeLevel })}
              />
            ),
          )}
        </UpgradeLevel>

        <ComponentBuildingParameters params={params} />
        <ComponentBuildingControls actions={controls} />
      </Wrapper>
    )
  );
};

ComponentBuildingInfo.displayName = 'ComponentBuildingInfo';
