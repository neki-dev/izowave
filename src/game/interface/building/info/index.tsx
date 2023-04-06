import cn from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { ComponentBuildingControls } from '~interface/building/controls';
import { ComponentBuildingParameters } from '~interface/building/parameters';
import { GameContext, useWorldUpdate } from '~lib/interface';
import { getMutable } from '~lib/utils';
import { WorldEvents } from '~type/world';
import { BuildingControl, BuildingParam, IBuilding } from '~type/world/entities/building';

import { Name, UpgradeLevel, Wrapper } from './styles';

export const ComponentBuildingInfo: React.FC = () => {
  const game = useContext(GameContext);

  const [building, setBuilding] = useState<IBuilding>(null);
  const [upgradeLevel, setUpgradeLevel] = useState(1);
  const [params, setParams] = useState<BuildingParam[]>([]);
  const [controls, setControls] = useState<BuildingControl[]>([]);

  const refBuilding = useRef<IBuilding>(null);
  const refWrapper = useRef<HTMLDivElement>(null);

  const onSelect = (target: IBuilding) => {
    refBuilding.current = target;
    setBuilding(target);
  };

  const onUnselect = () => {
    refBuilding.current = null;
    setBuilding(null);
    setParams([]);
    setControls([]);
  };

  useWorldUpdate(() => {
    if (!refBuilding.current) {
      return;
    }

    setUpgradeLevel(refBuilding.current.upgradeLevel);
    setParams((current) => getMutable(current, refBuilding.current.getInfo(), ['value', 'attention']));
    setControls((current) => getMutable(current, refBuilding.current.getControls(), ['label', 'cost']));

    if (refWrapper.current) {
      const camera = game.world.cameras.main;
      const x = Math.round((refBuilding.current.x - camera.worldView.x) * camera.zoom);
      const y = Math.round((refBuilding.current.y - camera.worldView.y) * camera.zoom);

      refWrapper.current.style.left = `${x}px`;
      refWrapper.current.style.top = `${y}px`;
    }
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

      <ComponentBuildingParameters params={params} />
      <ComponentBuildingControls actions={controls} />
    </Wrapper>
  );
};

ComponentBuildingInfo.displayName = 'ComponentBuildingInfo';
