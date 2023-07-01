import React, { useContext, useState } from 'react';

import { PLAYER_UPGRADES } from '~const/world/entities/player';
import { GameContext, useWorldUpdate } from '~lib/interface';
import { ComponentAmount } from '~scene/basic/ui/amount';
import { PlayerUpgrade, PlayerUpgradeData } from '~type/world/entities/player';

import { Item, Info, Action } from './styles';

type Props = {
  type: PlayerUpgrade
};

export const ComponentUpgradesListItem: React.FC<Props> = ({ type }) => {
  const game = useContext(GameContext);

  const [data, setData] = useState<PlayerUpgradeData>(null);

  const limit = data && data.maxLevel <= data.level;

  const onUpgrade = () => {
    game.world.player.upgrade(type);
  };

  useWorldUpdate(() => {
    const currentData: PlayerUpgradeData = {
      ...PLAYER_UPGRADES[type],
      experience: game.world.player.getExperienceToUpgrade(type),
      level: game.world.player.upgradeLevel[type],
    };

    setData(currentData);
  });

  return (
    data && (
      <Item>
        <Info>
          <Info.Label>{data.label}</Info.Label>
          <Info.Description>{data.description}</Info.Description>
          <Info.Value>
            LEVEL {data.level}
          </Info.Value>
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
