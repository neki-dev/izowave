import React from 'react';

import { Icon, State, Wrapper } from './styles';

type Props = {
  label: string
  children: string | number
  icon: string
};

export const ComponentWidget: React.FC<Props> = ({ label, children, icon }) => (
  <Wrapper>
    <Icon>
      <Icon.Image src={`assets/sprites/icons/${icon}.png`} />
    </Icon>
    <State>
      <State.Label>{label}</State.Label>
      <State.Amount>{children}</State.Amount>
    </State>
  </Wrapper>
);

ComponentWidget.displayName = 'ComponentWidget';
