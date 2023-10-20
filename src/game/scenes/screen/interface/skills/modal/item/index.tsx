import { useClick, useEvent, useScene } from 'phaser-react-ui';
import React, { useMemo, useRef, useState } from 'react';

import { PLAYER_MAX_SKILL_LEVEL } from '~const/world/entities/player';
import { phrase } from '~lib/lang';
import { Cost } from '~scene/system/interface/cost';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerEvents, PlayerSkill, PlayerSkillData } from '~type/world/entities/player';

import {
  Container, Info, Action, Label, Level, Button, Limit,
} from './styles';

type Props = {
  type: PlayerSkill
};

export const Item: React.FC<Props> = ({ type }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refContainer = useRef<HTMLDivElement>(null);

  const getData = (): PlayerSkillData => ({
    type,
    experience: world.player.getExperienceToUpgrade(type),
    currentLevel: world.player.upgradeLevel[type],
  });

  const [data, setData] = useState<PlayerSkillData>(getData);

  const levels = useMemo(() => Array.from({
    length: PLAYER_MAX_SKILL_LEVEL,
  }), []);

  useClick(refContainer, 'down', () => {
    world.player.upgrade(type);
  }, [type]);

  useEvent(world.player, PlayerEvents.UPGRADE_SKILL, () => {
    setData(getData());
  }, []);

  return (
    <Container ref={refContainer} $active={data.currentLevel < PLAYER_MAX_SKILL_LEVEL }>
      <Info>
        <Label>{phrase(`SKILL_LABEL_${data.type}`)}</Label>
        <Level>
          {levels.map((_, level) => (
            <Level.Progress
              key={level}
              $active={data.currentLevel && level < data.currentLevel}
            />
          ))}
        </Level>
      </Info>
      <Action>
        {data.currentLevel >= PLAYER_MAX_SKILL_LEVEL ? (
          <Limit>
            {phrase('SKILL_MAX_LEVEL')}
          </Limit>
        ) : (
          <>
            <Button>{phrase('SKILL_UPGRADE')}</Button>
            <Cost type="EXPERIENCE" value={data.experience} />
          </>
        )}
      </Action>
    </Container>
  );
};
