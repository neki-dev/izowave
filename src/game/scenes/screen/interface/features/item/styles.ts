import styled, { css, keyframes } from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

const animationTimeout = keyframes`
  0% { right: 0 }
  100% { right: 100% }
`;

export const Icon = styled.img`
  display: block;
  position: relative;
  z-index: 2;
  width: 24px;
  height: 24px;
`;

export const Info = styled.div`
  position: absolute;
  display: none;
  transform: translateX(-50%);
  bottom: 100%;
  left: 50%;
  margin-bottom: 14px;
  width: 180px;
  &::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid ${InterfaceColor.BLUE_DARK}cc;
  }
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${InterfaceColor.BLUE_BLACK}ee;
`;

export const Name = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  color: ${InterfaceColor.INFO};
  font-size: 14px;
  line-height: 14px;
  text-transform: uppercase;
`;

export const Description = styled.div`
  background: ${InterfaceColor.BLUE_DARK}cc;
  padding: 10px 14px 12px 14px;
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  color: #fff;
  font-weight: bold;
`;

export const Container = styled.div<{
  $active?: boolean
}>`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  pointer-events: all;
  position: relative;
  border-bottom: 4px solid #000;
  ${(props) => (props.$active ? css`
    ${Icon} {
      opacity: 0.5;
    }
  ` : css`
    &:hover {
      background-color: rgba(0, 0, 0, 0.75);
      cursor: pointer;
      ${Info} {
        display: block;
      }
    }
  `)}
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

export const Timeout = styled.div`
  position: absolute;
  background: ${InterfaceColor.INFO};
  right: 0;
  left: 0;
  bottom: -4px;
  height: 4px;
  animation: ${animationTimeout} 1s linear;
`;
