import styled, { css, keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

const animationBlink = keyframes`
  0% { background: ${InterfaceColor.INFO_DARK}; }
  50% { background: #586d1a; }
  100% { background: ${InterfaceColor.INFO_DARK}; }
`;

export const Container = styled.div<{
  $disabled?: boolean
  $disallow?: boolean
  $active?: boolean
  $newest?: boolean
}>`
  width: 60px;
  height: 60px;
  padding: 10px;
  background: ${InterfaceColor.BLACK_TRANSPARENT};
  display: flex;
  justify-content: center;
  position: relative;
  ${(props) => (!props.$disabled && css`
    &:hover {
      background: #000;
      cursor: pointer;
    }
  `)}
  ${(props) => ((props.$disabled || props.$disallow) && css`
    opacity: 0.5;
    filter: grayscale(100%);
  `)}
  ${(props) => (props.$active && css`
    opacity: 1.0;
    background: ${InterfaceColor.BLUE_DARK};
  `)}
  ${(props) => (props.$newest && css`
    &::after {
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
  `)}
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

export const Image = styled.img``;
