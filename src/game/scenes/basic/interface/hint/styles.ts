import styled, { keyframes } from 'styled-components';

import { InterfaceFont } from '~type/interface';

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

const animationKickTop = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(0, 10px) }
  100% { transform: translate(0, 0) }
`;

const animationKickBottom = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(0, -10px) }
  100% { transform: translate(0, 0) }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const Key = styled.span`
  display: inline-block;
  padding: 0 3px 1px 3px;
  font-size: 11px;
  line-height: 11px;
  border: 1px solid #fff;
`;

export const Container = styled.div`
  background: #000;
  padding: 10px 12px;
  color: #fff;
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 13px;
  line-height: 13px;
  white-space: pre;
  &::after {
    position: absolute;
    content: '';
  }
`;

export const Positioner = styled.div`
  position: absolute;
  &.side-left {
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
  &.side-right {
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
  &.side-top {
    padding-top: 10px;
    ${Container} {
      animation: ${animationKickTop} 1s infinite;
      &::after {
        top: 0;
        transform: translate(-50%, -100%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 10px solid #000;
      }
    }
    &.align-left {
      transform: translate(0, 0);
      ${Container}::after {
        left: 39px;
      }
    }
    &.align-center {
      transform: translate(-50%, 0);
      ${Container}::after {
        left: 50%;
      }
    }
    &.align-right {
      transform: translate(100%, 0);
      ${Container}::after {
        right: 39px;
      }
    }
  }
  &.side-bottom {
    padding-bottom: 10px;
    ${Container} {
      animation: ${animationKickBottom} 1s infinite;
      &::after {
        bottom: 0;
        transform: translate(-50%, 100%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid #000;
      }
    }
    &.align-left {
      transform: translate(0, -100%);
      ${Container}::after {
        left: 39px;
      }
    }
    &.align-center {
      transform: translate(-50%, -100%);
      ${Container}::after {
        left: 50%;
      }
    }
    &.align-right {
      transform: translate(100%, -100%);
      ${Container}::after {
        right: 39px;
      }
    }
  }
`;
