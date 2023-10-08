import {
  ifModifiedObject,
  useMatchMedia,
  useMobilePlatform,
  useScene,
  useSceneUpdate,
} from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { PLAYER_MAX_SKILL_LEVEL, PLAYER_SKILLS } from '~const/world/entities/player';
import { Cost } from '~scene/system/interface/cost';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerSkill, PlayerSkillData } from '~type/world/entities/player';

import {
  Container, Info, Action, Label, Level, Button, Limit,
} from './styles';

type Props = {
  type: PlayerSkill
};

export const UpgradesListItem: React.FC<Props> = ({ type }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const isMobile = useMobilePlatform();
  const isSmallScreen = useMatchMedia(INTERFACE_MOBILE_BREAKPOINT);

  const getData = (): PlayerSkillData => ({
    ...PLAYER_SKILLS[type],
    experience: world.player.getExperienceToUpgrade(type),
    currentLevel: world.player.upgradeLevel[type],
  });

  const [data, setData] = useState<PlayerSkillData>(getData);

  const levels = useMemo(() => Array.from({
    length: PLAYER_MAX_SKILL_LEVEL,
  }), []);

  const onClick = () => {
    world.player.upgrade(type);
  };

  useSceneUpdate(world, () => {
    setData(ifModifiedObject(getData()));
  }, []);

  return (
    <Container>
      <Info>
        <Label>{data.label}</Label>
        <Level>
          {levels.map((_, level) => (
            <Level.Progress
              key={level}
              $active={data.currentLevel && level < data.currentLevel}
            />
          ))}
        </Level>
      </Info>
      {data.currentLevel >= PLAYER_MAX_SKILL_LEVEL ? (
        <Action>
          <Limit>
            MAX
            <br />
            LEVEL
          </Limit>
        </Action>
      ) : (
        <Action
          {...{
            [isMobile ? 'onTouchEnd' : 'onClick']: onClick,
          }}
          $active
        >
          <Button>UPGRADE</Button>
          <Cost
            type="experience"
            value={data.experience}
            size={isSmallScreen ? 'small' : 'medium'}
          />
        </Action>
      )}
    </Container>
  );
};
