import styled, { keyframes } from 'styled-components';

import { INTERFACE_FONT } from '~const/interface';

const animationKickLeft = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(10px, 0) }
  100% { transform: translate(0, 0) }
`;

const animationKickRight = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(-10px, 0) }
  100% { transform: translate(0, 0) }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const Container = styled.div`
  background: #000;
  padding: 10px 12px;
  color: #fff;
  font-family: ${INTERFACE_FONT.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  text-transform: uppercase;
  &::after {
    position: absolute;
    content: '';
  }
`;

export const Positioner = styled.div`
  position: absolute;
  width: 200px;
  &.left {
    padding-left: 10px;
    transform: translate(0, -50%);
    ${Container} {
      animation: ${animationKickLeft} 1s infinite;
      &::after {
        left: 0;
        top: 50%;
        transform: translate(-100%, -50%);
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 10px solid #000;
      }
    }
  }
  &.right {
    padding-right: 10px;
    transform: translate(-100%, -50%);
    ${Container} {
      animation: ${animationKickRight} 1s infinite;
      &::after {
        right: 0;
        top: 50%;
        transform: translate(100%, -50%);
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 10px solid #000;
      }
    }
  }
  &.top {
    padding-top: 10px;
    ${Container} {
      &::after {
        top: 0;
        left: 50%;
        transform: translate(-50%, -100%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 10px solid #000;
      }
    }
  }
  &.bottom {
    padding-bottom: 10px;
    ${Container} {
      &::after {
        bottom: 0;
        left: 50%;
        transform: translate(-50%, -100%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid #000;
      }
    }
  }
`;
