import { getModifiedObject, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { PLAYER_UPGRADES } from '~const/world/entities/player';
import { ComponentAmount } from '~scene/basic/interface/amount';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerUpgrade, PlayerUpgradeData } from '~type/world/entities/player';

import { Item, Info, Action } from './styles';

type Props = {
  type: PlayerUpgrade
};

export const ComponentUpgradesListItem: React.FC<Props> = ({ type }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [data, setData] = useState<Nullable<PlayerUpgradeData>>(null);

  const limit = data?.currentLevel && data.maxLevel <= data.currentLevel;

  const onUpgrade = () => {
    world.player.upgrade(type);
  };

  useSceneUpdate(world, () => {
    const newData: PlayerUpgradeData = {
      ...PLAYER_UPGRADES[type],
      experience: world.player.getExperienceToUpgrade(type),
      currentLevel: world.player.upgradeLevel[type],
    };

    setData((current) => getModifiedObject(current, newData));
  });

  return (
    data && (
      <Item>
        <Info>
          <Info.Label>{data.label}</Info.Label>
          <Info.Description>{data.description}</Info.Description>
          <Info.Level>LEVEL {data.currentLevel}</Info.Level>
        </Info>
        {limit ? (
          <Action>
            <Action.Limit>
              MAX
              <br />
              LEVEL
            </Action.Limit>
          </Action>
        ) : (
          <Action onClick={onUpgrade} className="active">
            <Action.Button>UPGRADE</Action.Button>
            <Action.Experience>
              <ComponentAmount type="experience" value={data.experience} />
            </Action.Experience>
          </Action>
        )}
      </Item>
    )
  );
};

ComponentUpgradesListItem.displayName = 'ComponentUpgradesListItem';
