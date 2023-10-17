import {
  ifModifiedObject,
  useClick,
  useScene,
  useSceneUpdate,
} from 'phaser-react-ui';
import React, { useMemo, useRef, useState } from 'react';

import { PLAYER_MAX_SKILL_LEVEL, PLAYER_SKILLS } from '~const/world/entities/player';
import { phrase } from '~lib/lang';
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

export const Item: React.FC<Props> = ({ type }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refAction = useRef<HTMLDivElement>(null);

  const getData = (): PlayerSkillData => ({
    type,
    target: PLAYER_SKILLS[type].target,
    experience: world.player.getExperienceToUpgrade(type),
    currentLevel: world.player.upgradeLevel[type],
  });

  const [data, setData] = useState<PlayerSkillData>(getData);

  const levels = useMemo(() => Array.from({
    length: PLAYER_MAX_SKILL_LEVEL,
  }), []);

  useClick(refAction, 'down', () => {
    world.player.upgrade(type);
  }, [type]);

  useSceneUpdate(world, () => {
    setData(ifModifiedObject(getData()));
  }, []);

  return (
    <Container>
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
      {data.currentLevel >= PLAYER_MAX_SKILL_LEVEL ? (
        <Action>
          <Limit>
            {phrase('SKILL_MAX_LEVEL')}
          </Limit>
        </Action>
      ) : (
        <Action ref={refAction} $active={true}>
          <Button>{phrase('SKILL_UPGRADE')}</Button>
          <Cost type="experience" value={data.experience} />
        </Action>
      )}
    </Container>
  );
};
