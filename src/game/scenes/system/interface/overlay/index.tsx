import { useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~lib/interface/const';

import { Wrapper } from './styles';

type Props = {
  children: React.ReactNode
};

export const Overlay: React.FC<Props> = ({ children }) => {
  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  return <Wrapper ref={refScale}>{children}</Wrapper>;
};
