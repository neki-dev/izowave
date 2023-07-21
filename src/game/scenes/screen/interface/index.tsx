import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~const/interface';

import { Builder } from './builder';
import { Debug } from './debug';
import { Features } from './features';
import { GeneralHints } from './general-hints';
import { Notices } from './notices';
import { PlayerHUD } from './player-hud';
import { Column, Grid, Wrapper } from './styles';
import { Wave } from './wave';

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
          <Wave />
          <GeneralHints />
          <Features />
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
