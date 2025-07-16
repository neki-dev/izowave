import { Texture, useClick, useEvent, useScene } from 'phaser-react-ui';
import React, { useMemo, useRef, useState } from 'react';

import { phrase } from '~core/lang';
import { GameScene } from '~game/types';
import { Cost } from '~scene/system/interface/cost';
import type { WorldScene } from '~scene/world';
import { PLAYER_MAX_SKILL_LEVEL } from '~scene/world/entities/player/const';
import type { PlayerSkill, PlayerSkillData } from '~scene/world/entities/player/types';
import { PlayerEvent, PlayerSkillIcon } from '~scene/world/entities/player/types';

import {
  Container, Info, Action, Label, Level, Button, Limit, Icon, Head,
} from './styles';

type Props = {
  type: PlayerSkill
};

export const Item: React.FC<Props> = ({ type }) => {
  const world = useScene<WorldScene>(GameScene.WORLD);

  const refContainer = useRef<HTMLDivElement>(null);

  const getData = (): PlayerSkillData => ({
    type,
    experience: world.player.getExperienceToUpgrade(type),
    currentLevel: world.player.upgradeLevel[type],
  });

  const [data, setData] = useState(getData);

  const levels = useMemo(() => Array.from({
    length: PLAYER_MAX_SKILL_LEVEL,
  }), []);

  useClick(refContainer, 'down', () => {
    world.player.upgrade(type);
  }, [type]);

  useEvent(world.player, PlayerEvent.UPGRADE_SKILL, () => {
    setData(getData());
  }, []);

  return (
    <Container ref={refContainer} $active={data.currentLevel < PLAYER_MAX_SKILL_LEVEL }>
      <Info>
        <Icon>
          <Texture name={PlayerSkillIcon[data.type]} />
        </Icon>
        <Head>
          <Label>{phrase(`SKILL_LABEL_${data.type}`)}</Label>
          <Level>
            {levels.map((_, level) => (
              <Level.Progress
                key={level}
                $active={data.currentLevel && level < data.currentLevel}
              />
            ))}
          </Level>
        </Head>
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
