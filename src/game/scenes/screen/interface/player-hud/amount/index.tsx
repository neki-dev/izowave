import React from 'react';

import { Icon, Value, Wrapper } from './styles';

type Props = {
  children: string | number
  icon: string
};

export const Amount: React.FC<Props> = ({ children, icon }) => (
  <Wrapper>
    <Icon>
      <Icon.Image src={`assets/sprites/interface/hud/${icon}.png`} />
    </Icon>
    <Value>
      {children}
    </Value>
  </Wrapper>
);
