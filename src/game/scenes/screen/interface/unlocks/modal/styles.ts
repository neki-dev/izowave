import styled, { keyframes } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

const animationOpacity = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: all;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background-black-75);
  z-index: var(--layer-overlay);
  animation: ${animationOpacity} 0.2s ease-in;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    background: rgba(0, 0, 0, 0.85);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 30px;
  }
`;

export const Label = styled.div`
  color: #fff;
  font-family: var(--font-pixel-label);
  font-size: 24px;
  line-height: 28px;
  white-space: pre;
  text-align: center;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 16px;
    line-height: 20px;
  }
`;

export const List = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.div`
  pointer-events: all;
  color: #fff;
  font-family: var(--font-pixel-label);
  border-radius: 5px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background-success-gradient);  
  font-size: 18px;
  line-height: 18px;
  padding: 20px 25px;
  &:hover {
    cursor: pointer;
    background: var(--color-background-success);
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 14px;
    line-height: 14px;
    padding: 15px 20px;
  }
`;
