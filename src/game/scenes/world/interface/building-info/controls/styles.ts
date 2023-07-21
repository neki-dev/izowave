import styled from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 100px;
  position: absolute;
  left: 50%;
`;

export const Action = styled.div`
  padding: 3px 7px 4px 7px;
  background: ${InterfaceColor.BLACK_TRANSPARENT};
  transform: translateX(-50%);
  pointer-events: all;
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 3px;
  }
  &:hover {
    cursor: pointer;
    background: #000;
  }
`;

export const Label = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
`;

export const Addon = styled.div`
  margin: 1px 0 0 6px;
`;
