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
        <Column className="left">
          <PlayerHUD />
          <Debug />
        </Column>

        <Column className="center">
          <Wave />
          <GeneralHints />
          <Features />
        </Column>

        <Column className="right">
          <Builder />
        </Column>
      </Grid>

      <Notices />
    </Wrapper>
  );
};

ScreenUI.displayName = 'ScreenUI';
