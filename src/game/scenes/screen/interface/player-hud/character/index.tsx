import React from 'react';

import { Health } from './health';

import { Container, Avatar, Image } from './styles';

export const Character: React.FC = () => (
  <Container>
    <Avatar>
      <Image src="assets/sprites/hud/avatar.png" />
    </Avatar>
    <Health />
  </Container>
);
