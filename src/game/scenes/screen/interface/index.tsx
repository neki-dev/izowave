import React from 'react';

import { ComponentBuilder } from './builder';
import { ComponentDebug } from './debug';
import { ComponentGeneralHints } from './general-hints';
import { ComponentHUD } from './hud';
import { ComponentNotices } from './notices';
import { Column, Grid, Overlay } from './styles';
import { ComponentWave } from './wave';

export const ScreenUI: React.FC = () => (
  <Overlay>
    <Grid>
      <Column className='left'>
        <ComponentHUD />
        <ComponentDebug />
      </Column>

      <Column className='center'>
        <ComponentWave />
      </Column>

      <Column className='right'>
        <ComponentBuilder />
      </Column>
    </Grid>

    <ComponentNotices />
    <ComponentGeneralHints />
  </Overlay>
);

ScreenUI.displayName = 'ScreenUI';
