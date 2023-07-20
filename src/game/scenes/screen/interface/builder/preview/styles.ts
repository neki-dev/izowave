import styled, { keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

const animationBlink = keyframes`
  0% { background: ${InterfaceColor.INFO_DARK}; }
  50% { background: #586d1a; }
  100% { background: ${InterfaceColor.INFO_DARK}; }
`;

export const Building = styled.div`
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
  &.disabled,
  &.disallow {
    opacity: 0.5;
    filter: grayscale(100%);
  }
  &.active {
    opacity: 1.0;
    background: ${InterfaceColor.BLUE_DARK};
  }
  &.newest::after {
    position: absolute;
    content: 'new';
    color: #fff;
    font-family: ${InterfaceFont.MONOSPACE};
    font-size: 10px;
    line-height: 10px;
    left: -3px;
    top: -3px;
    border-radius: 5px;
    background: ${InterfaceColor.INFO_DARK};
    padding: 2px 4px;
    animation: ${animationBlink} 1s infinite;
  }
`;

export const Preview = styled.div`
  overflow: hidden;
  width: 34px;
  height: 40px;
  img {
    height: 100%;
  }
`;

export const Number = styled.div`
  position: absolute;
  color: #fff;
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  right: 4px;
  top: 4px;
  opacity: 0.75;
`;
