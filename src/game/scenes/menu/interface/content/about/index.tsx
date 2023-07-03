import React from 'react';

import { Wrapper } from './styles';

export const ComponentAbout: React.FC = () => (
  <Wrapper>
    Your task is to survive in open world as many waves as possible. With each
    wave count of enemies and their characteristics will grow.
    <br />
    <br />
    Between waves build walls to defend, towers to attack, generators to get
    resources, ammunitions to reload towers, and medics to replenish your
    health.
    <br />
    <br />
    And also upgrade skills of your character and his assistant.
  </Wrapper>
);

ComponentAbout.displayName = 'ComponentAbout';
