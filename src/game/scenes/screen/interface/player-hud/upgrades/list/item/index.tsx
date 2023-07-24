import { getModifiedObject, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { PLAYER_UPGRADES } from '~const/world/entities/player';
import { Cost } from '~scene/system/interface/cost';
import { Text } from '~scene/system/interface/text';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerUpgrade, PlayerUpgradeData } from '~type/world/entities/player';

import {
  Item,
  Info,
  Action,
  Label,
  Level,
  Button,
  Limit,
} from './styles';

type Props = {
  type: PlayerUpgrade
};

export const UpgradesListItem: React.FC<Props> = ({ type }) => {
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
          <Label>{data.label}</Label>
          <Text>{data.description}</Text>
          <Level>LEVEL <b>{data.currentLevel}</b></Level>
        </Info>
        {limit ? (
          <Action>
            <Limit>
              MAX
              <br />
              LEVEL
            </Limit>
          </Action>
        ) : (
          <Action onClick={onUpgrade} $active>
            <Button>UPGRADE</Button>
            <Cost type="experience" value={data.experience} size='large' />
          </Action>
        )}
      </Item>
    )
  );
};
