import React from 'react';

import pkg from '../../../../../../package.json';
import { Environment } from '~lib/environment';
import { GameFlag } from '~type/game';

import {
  Wrapper, Icon, About, Discord, Author, Link,
} from './styles';

export const Copyright: React.FC = () => (
  <Wrapper>
    <About>
      <Author>
        Created by{' '}
        {Environment.GetFlag(GameFlag.COPYRIGHT) ? (
          <Link href={pkg.author.url} target="_blank">
            {pkg.author.name}
          </Link>
        ) : pkg.author.name}
      </Author>
      Version {pkg.version}
    </About>
    <Discord href='https://discord.gg/cnFAdMsRxn' target="_blank">
      <Icon src='assets/discord.png' />
      DISCORD
    </Discord>
  </Wrapper>
);
