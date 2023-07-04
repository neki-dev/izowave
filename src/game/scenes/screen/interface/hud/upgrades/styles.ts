import styled from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  position: relative;
`;

export const Button = styled.div`
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 10px;
  line-height: 10px;
  text-shadow: 1px 1px 0 #000;
  width: 80px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  &:hover {
    cursor: pointer;
    background: ${InterfaceColor.BLUE_DARK};
  }
  &.active {
    background: ${InterfaceColor.BLUE};
  }
`;
