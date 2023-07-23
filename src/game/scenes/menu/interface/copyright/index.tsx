import React from 'react';

import pkg from '../../../../../../package.json';

import {
  Wrapper, Icon, About, Discord, Link,
} from './styles';

export const Copyright: React.FC = () => (
  <Wrapper>
    <About>
      Created by{' '}
      <Link href={pkg.author.url} target="_blank">
        {pkg.author.name}
      </Link>
      <br />
      Version {pkg.version}
    </About>
    <Discord href='https://discord.gg/cnFAdMsRxn' target="_blank">
      <Icon src='assets/discord.png' />
      DISCORD
    </Discord>
  </Wrapper>
);
