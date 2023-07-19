import React from 'react';

import { Container, Image } from './styles';

export const ComponentAvatar: React.FC = () => (
  <Container>
    <Image src="assets/sprites/interface/hud/avatar.png" />
  </Container>
);

ComponentAvatar.displayName = 'ComponentAvatar';
