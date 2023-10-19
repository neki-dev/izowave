import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~const/interface';
import { Section } from '~scene/system/interface/section';

import { AdsReward } from './ads-reward';
import { Builder } from './builder';
import { Debug } from './debug';
import { Modes } from './modes';
import { Notices } from './notices';
import { PlayerHUD } from './player-hud';
import { Skills } from './skills';
import { Column, Grid, Wrapper } from './styles';
import { Superskills } from './superskills';
import { Wave } from './wave';

export const ScreenUI: React.FC = () => {
  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  return (
    <Wrapper ref={refScale}>
      <AdsReward />

      <Grid>
        <Column $side="left">
          <PlayerHUD />
          <Debug />
        </Column>

        <Column $side="center">
          <Section direction='horizontal' gap={1}>
            <Wave />
            <Modes />
            <Skills />
          </Section>
          <Superskills />
        </Column>

        <Column $side="right">
          <Builder />
        </Column>
      </Grid>

      <Notices />
    </Wrapper>
  );
};

ScreenUI.displayName = 'ScreenUI';
