import { useClick } from 'phaser-react-ui';
import React, { useRef } from 'react';

import { PLAYER_SKILLS } from '~const/world/entities/player';
import { phrase } from '~lib/lang';
import { mapEntries } from '~lib/utils';
import { PlayerSkillTarget } from '~type/world/entities/player';

import { Item } from './item';
import {
  Container, Groups, Group, Target, List, Backdrop, Overlay, Close,
} from './styles';

type Props = {
  onClose: () => void
};

export const Modal: React.FC<Props> = ({ onClose }) => {
  const refOverlay = useRef<HTMLDivElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const refClose = useRef<HTMLDivElement>(null);

  useClick(refContainer, 'down', () => {}, []);
  useClick(refClose, 'down', onClose, []);
  useClick(refOverlay, 'down', onClose, []);

  return (
    <>
      <Backdrop />
      <Overlay ref={refOverlay}>
        <Container ref={refContainer}>
          <Close ref={refClose}>{phrase('SKILLS_CLOSE')}</Close>
          <Groups>
            {mapEntries(PlayerSkillTarget, (key, target) => (
              <Group key={key}>
                <Target>{phrase(`SKILL_TARGET_${target}`)}</Target>
                <List>
                  {mapEntries(PLAYER_SKILLS, (type, skill) => skill.target === target && (
                    <Item key={type} type={type} />
                  ))}
                </List>
              </Group>
            ))}
          </Groups>
        </Container>
      </Overlay>
      </>
  );
};
