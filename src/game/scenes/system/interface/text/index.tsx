import React from 'react';

import { Wrapper } from './styles';

type Props = {
  children: React.ReactNode
};

export const Text: React.FC<Props> = ({ children }) => (
  <Wrapper>{children}</Wrapper>
);
