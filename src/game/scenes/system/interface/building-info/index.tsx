import { ifModifiedArray, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { BuildingParams } from '~scene/system/interface/building-params';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import {
  BuildingControl,
  BuildingParam,
  IBuilding,
} from '~type/world/entities/building';

import { BuildingControls } from './controls';
import {
  Name, Level, Health, Wrapper, Head, Body, Container,
} from './styles';

type Props = {
  building: IBuilding
};

export const BuildingInfo: React.FC<Props> = ({ building }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [upgradeLevel, setUpgradeLevel] = useState(1);
  const [health, setHealth] = useState(1);
  const [maxHealth, setMaxHealth] = useState(1);
  const [params, setParams] = useState<BuildingParam[]>([]);
  const [controls, setControls] = useState<BuildingControl[]>([]);

  const levels = useMemo(() => Array.from({
    length: building.getMeta().MaxLevel,
  }), [building]);

  useSceneUpdate(world, () => {
    if (!building.active) {
      return;
    }

    setUpgradeLevel(building.upgradeLevel);
    setHealth(building.live.health);
    setMaxHealth(building.live.maxHealth);
    setParams(ifModifiedArray(building.getInfo(), ['value', 'attention']));
    setControls(ifModifiedArray(building.getControls(), ['label', 'cost', 'disabled']));
  }, [building]);

  return (
    <Wrapper>
      <Container>
        <Head>
          <Name>{building.getMeta().Name}</Name>
        </Head>
        <Body>
          <Health>
            <Health.Progress
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
            <Health.Value>{`${health} HP`}</Health.Value>
          </Health>
          <Level $count={levels.length}>
            {levels.map((_, level) => (
              <Level.Progress key={level} $active={level < upgradeLevel} />
            ))}
          </Level>
          <BuildingParams list={params} adaptive={true} />
        </Body>
      </Container>

      <BuildingControls list={controls} />
    </Wrapper>
  );
};
