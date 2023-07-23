import styled from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 100px;
  color: rgba(255, 255, 255, 0.5);
  font-family: ${InterfaceFont.MONOSPACE};
  white-space: pre-line;
  text-align: right;
`;

export const Link = styled.a`
  color: rgba(255, 255, 255, 0.75);
  pointer-events: all;
  &:hover {
    color: ${InterfaceColor.INFO};
  }
`;
