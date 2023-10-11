import { useMatchMedia, useOutsideClick } from 'phaser-react-ui';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { PLAYER_SKILLS } from '~const/world/entities/player';
import { Tutorial } from '~lib/tutorial';
import { Button } from '~scene/system/interface/button';
import { Hint } from '~scene/system/interface/hint';
import { TutorialStep } from '~type/tutorial';
import { PlayerSkill, PlayerSkillTarget } from '~type/world/entities/player';

import { UpgradesListItem } from './item';
import { Wrapper, Container, Targets } from './styles';

export const Skills: React.FC = () => {
  const isSmallScreen = useMatchMedia(INTERFACE_MOBILE_BREAKPOINT);

  const [target, setTarget] = useState<PlayerSkillTarget>(
    PlayerSkillTarget.CHARACTER,
  );

  const targetTypes = useMemo(
    () => Object.keys(PlayerSkillTarget) as PlayerSkillTarget[],
    [],
  );

  const upgradeTypes = useMemo(
    () => Object.entries(PLAYER_SKILLS)
      .filter(([, data]) => data.target === target)
      .map(([type]) => type) as PlayerSkill[],
    [target],
  );

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
        SKILLS
      </Button>
      {isOpened ? (
        <Container>
          <div>
            <Targets>
              {targetTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => setTarget(type)}
                  view={target === type ? 'confirm' : undefined}
                >
                  {type}
                </Button>
              ))}
            </Targets>
            {upgradeTypes.map((type) => (
              <UpgradesListItem key={type} type={type} />
            ))}
          </div>
          {isSmallScreen && <Button onClick={onClick}>Close</Button>}
        </Container>
      ) : (
        hint && (
          <Hint side="top" align="left">
            Click to upgrade skills
          </Hint>
        )
      )}
    </Wrapper>
  );
};
