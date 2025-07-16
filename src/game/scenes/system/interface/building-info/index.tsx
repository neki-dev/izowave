import { ifModifiedArray, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useEffect, useMemo, useState } from 'react';

import { Controls } from './controls';
import { Params } from './params';

import { phrase } from '~core/lang';
import type { WorldScene } from '~game/scenes/world';
import type { Building } from '~game/scenes/world/entities/building';
import { GameScene } from '~game/types';
import type { BuildingParam, BuildingControl } from '~scene/world/entities/building/types';

import { Name, Level, Health, Wrapper, Head, Body, Container } from './styles';

type Props = {
  building: Building
};

export const BuildingInfo: React.FC<Props> = ({ building }) => {
  const world = useScene<WorldScene>(GameScene.WORLD);

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

  useEffect(() => {
    setControls(building.getControls());
  }, [building]);

  return (
    <Wrapper>
      <Container>
        <Head>
          <Name>{phrase(`BUILDING_NAME_${building.variant}`)}</Name>
        </Head>
        <Body>
          <Health>
            <Health.Progress
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
            <Health.Value>{`${health} HP`}</Health.Value>
          </Health>
          <Level>
            {levels.map((_, level) => (
              <Level.Progress key={level} $active={level < upgradeLevel} />
            ))}
          </Level>
          {params.length > 0 && (
            <Params list={params} />
          )}
        </Body>
      </Container>
      <Controls list={controls} />
    </Wrapper>
  );
};
