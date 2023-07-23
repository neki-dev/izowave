import React from 'react';

import pkg from '../../../../../../package.json';

import { Wrapper, Link } from './styles';

export const Copyright: React.FC = () => (
  <Wrapper>
    Created by{' '}
    <Link href={pkg.author.url} target="_blank">
      {pkg.author.name}
    </Link>
    <br />
    Version {pkg.version}
  </Wrapper>
);
