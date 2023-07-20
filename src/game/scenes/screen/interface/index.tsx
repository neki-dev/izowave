import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~const/interface';

import { ComponentBuilder } from './builder';
import { ComponentDebug } from './debug';
import { ComponentFeatures } from './features';
import { ComponentGeneralHints } from './general-hints';
import { ComponentHUD } from './hud';
import { ComponentNotices } from './notices';
import { Column, Grid, Overlay } from './styles';
import { ComponentWave } from './wave';

export const ScreenUI: React.FC = () => {
  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  return (
    <Overlay ref={refScale}>
      <Grid>
        <Column className="left">
          <ComponentHUD />
          <ComponentDebug />
        </Column>

        <Column className="center">
          <ComponentWave />
          <ComponentFeatures />
        </Column>

        <Column className="right">
          <ComponentBuilder />
        </Column>
      </Grid>

      <ComponentNotices />
      <ComponentGeneralHints />
    </Overlay>
  );
};

ScreenUI.displayName = 'ScreenUI';
