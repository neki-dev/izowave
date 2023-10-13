import { useMatchMedia, useOutsideClick } from 'phaser-react-ui';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { PLAYER_SKILLS } from '~const/world/entities/player';
import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { Button } from '~scene/system/interface/button';
import { Hint } from '~scene/system/interface/hint';
import { TutorialStep } from '~type/tutorial';
import { PlayerSkill, PlayerSkillTarget } from '~type/world/entities/player';

import { Item } from './item';
import {
  Wrapper, Container, Targets, List,
} from './styles';

export const Skills: React.FC = () => {
  const isSmallScreen = useMatchMedia(INTERFACE_MOBILE_BREAKPOINT);

  const [target, setTarget] = useState<PlayerSkillTarget>(PlayerSkillTarget.CHARACTER);

  const targetTypes = useMemo(() => (
    Object.keys(PlayerSkillTarget) as PlayerSkillTarget[]
  ), []);

  const upgradeTypes = useMemo(() => (
    Object.entries(PLAYER_SKILLS)
      .filter(([, data]) => data.target === target)
      .map(([type]) => type) as PlayerSkill[]
  ), [target]);

  const [isOpened, setOpened] = useState(false);
  const [hint, setHint] = useState(false);

  const refContainer = useRef<HTMLDivElement>(null);

  const onClick = () => {
    setOpened(!isOpened);
  };

  const onClose = () => {
    setOpened(false);
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      event.stopPropagation();
    }
  };

  useOutsideClick(
    refContainer,
    () => {
      onClose();
    },
    [],
  );

  useEffect(() => {
    if (!isOpened) {
      return;
    }

    document.addEventListener('keyup', onKeyPress);

    return () => {
      document.removeEventListener('keyup', onKeyPress);
    };
  }, [isOpened]);

  useEffect(
    () => Tutorial.Bind(TutorialStep.UPGRADE_SKILL, {
      beg: () => setHint(true),
      end: () => setHint(false),
    }),
    [],
  );

  return (
    <Wrapper ref={refContainer}>
      <Button onClick={onClick} view={isOpened ? 'active' : undefined}>
        {phrase('SKILLS')}
      </Button>
      {isOpened ? (
        <Container>
          <Targets>
            {targetTypes.map((type) => (
              <Button
                key={type}
                onClick={() => setTarget(type)}
                view={target === type ? 'confirm' : undefined}
              >
                {phrase(`SKILL_TARGET_${type}`)}
              </Button>
            ))}
          </Targets>
          <List>
            {upgradeTypes.map((type) => (
              <Item key={type} type={type} />
            ))}
          </List>
          {isSmallScreen && <Button onClick={onClick}>Close</Button>}
        </Container>
      ) : (
        hint && (
          <Hint label='TUTORIAL_CLICK_TO_UPGRADE' side="top" align="left" />
        )
      )}
    </Wrapper>
  );
};
