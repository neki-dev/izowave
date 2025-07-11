import React from 'react';

import { Health } from './health';
import imageAvatar from './images/avatar.png';

import { Container, Avatar, Image } from './styles';

export const Character: React.FC = () => (
  <Container>
    <Avatar>
      <Image src={imageAvatar} />
    </Avatar>
    <Health />
  </Container>
);
