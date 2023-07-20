import {
  getModifiedArray,
  RelativePosition,
  useScene,
  useSceneUpdate,
} from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { BuildingParams } from '~scene/system/interface/building-params';
import { GameScene } from '~type/game';
import { IWorld, WorldEvents } from '~type/world';
import {
  BuildingControl,
  BuildingParam,
  IBuilding,
} from '~type/world/entities/building';

import { BuildingControls } from './controls';
import {
  Name, UpgradeLevel, Wrapper, Head, Body, Progress,
} from './styles';

export const BuildingInfo: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [building, setBuilding] = useState<Nullable<IBuilding>>(null);
  const [upgradeLevel, setUpgradeLevel] = useState(1);
  const [params, setParams] = useState<BuildingParam[]>([]);
  const [controls, setControls] = useState<BuildingControl[]>([]);

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

  useSceneUpdate(
    world,
    () => {
      if (!building) {
        return;
      }

      setUpgradeLevel(building.upgradeLevel);
      setParams((current) => getModifiedArray(current, building.getInfo(), ['value', 'attention']));
      setControls((current) => getModifiedArray(current, building.getControls(), ['label', 'cost']));
    },
    [building],
  );

  return (
    building && (
      <RelativePosition x={building.x} y={building.y}>
        <Wrapper>
          <Head>
            <Name>{building.getMeta().Name}</Name>
          </Head>
          <Body>
            <UpgradeLevel>
              {Array.from({ length: BUILDING_MAX_UPGRADE_LEVEL }).map(
                (_, level) => (
                  <Progress key={level} $active={level < upgradeLevel} />
                ),
              )}
            </UpgradeLevel>
            <BuildingParams list={params} />
          </Body>

          <BuildingControls list={controls} />
        </Wrapper>
      </RelativePosition>
    )
  );
};
