import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { Builder } from './builder';
import { Debug } from './debug';
import { Modes } from './modes';
import { Notices } from './notices';
import { PlayerHUD } from './player-hud';
import { Skills } from './skills';
import { Superskills } from './superskills';
import { Unlocks } from './unlocks';
import { Wave } from './wave';

import { INTERFACE_SCALE } from '~core/interface/const';
import { Section } from '~scene/system/interface/section';

import { Column, Grid, Wrapper } from './styles';

export const ScreenUI: React.FC = () => {
  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  return (
    <Wrapper ref={refScale}>
      <Grid>
        <Column $side="left">
          <PlayerHUD />
          <Debug />
        </Column>
        <Column $side="center">
          <Section direction='vertical' gap={8}>
            <Section direction='horizontal' gap={1}>
              <Wave />
              <Modes />
              <Skills />
            </Section>
            <Notices />
          </Section>
          <Superskills />
        </Column>
        <Column $side="right">
          <Builder />
        </Column>
      </Grid>
      <Unlocks />
    </Wrapper>
  );
};
