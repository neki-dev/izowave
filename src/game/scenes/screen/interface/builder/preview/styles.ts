import styled, { keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

const animationBlink = keyframes`
  0% { background: ${InterfaceColor.INFO} }
  50% { background: ${InterfaceColor.INFO_DARK} }
  100% { background: ${InterfaceColor.INFO} }
`;

export const Building: any = styled.div`
  width: 60px;
  height: 60px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  position: relative;
  &:not(.disabled):hover {
    background: #000;
    cursor: pointer;
  }
  &.disallow {
    opacity: 0.5;
    filter: grayscale(100%);
  }
  &.disabled {
    opacity: 0.25;
  }
  &.active {
    opacity: 1.0;
    background: ${InterfaceColor.BLUE_DARK};
  }
  &.newest::after {
    position: absolute;
    content: '';
    left: -2px;
    top: -2px;
    border-radius: 50%;
    background: ${InterfaceColor.INFO};
    width: 10px;
    height: 10px;
    animation: ${animationBlink} 1s infinite;
  }
`;

Building.Preview = styled.div`
  overflow: hidden;
  width: 34px;
  height: 40px;
  img {
    height: 100%;
  }
`;

Building.Number = styled.div`
  position: absolute;
  color: #fff;
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  right: 4px;
  top: 4px;
  opacity: 0.75;
`;
