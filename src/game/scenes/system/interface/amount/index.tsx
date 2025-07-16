import React from 'react';

import imageExperience from './images/experience.png';
import imageResources from './images/resources.png';
import imageScore from './images/score.png';

import { phrase } from '~core/lang';

import { Icon, IconContainer, Value, Wrapper, Container, Placeholder } from './styles';

type Props = {
  children: React.ReactNode
  type: 'RESOURCES' | 'EXPERIENCE' | 'SCORE'
  placeholder?: boolean
};

const IMAGES = {
  RESOURCES: imageResources,
  EXPERIENCE: imageExperience,
  SCORE: imageScore,
};

export const Amount: React.FC<Props> = ({ children, type, placeholder }) => (
  <Wrapper>
    <Container>
      <IconContainer>
        <Icon src={IMAGES[type]} />
      </IconContainer>
      <Value>{children}</Value>
    </Container>
    {placeholder && (
      <Placeholder>{phrase(type)}</Placeholder>
    )}
  </Wrapper>
);
