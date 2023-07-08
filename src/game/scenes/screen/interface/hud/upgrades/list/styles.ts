import styled, { keyframes } from 'styled-components';

import { InterfaceColor } from '~type/interface';

const animationOpacity = keyframes`
  0% { opacity: 0; margin-top: 0 }
  100% { opacity: 1; margin-top: 20px }
`;

export const Container = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${InterfaceColor.BLUE_DARK}cc;
  padding: 20px;
  margin-top: 20px;
  pointer-events: all;
  animation: ${animationOpacity} 0.1s ease-in;
  &::after {
    position: absolute;
    content: '';
    top: -14px;
    left: 39px;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 14px solid ${InterfaceColor.BLUE_DARK}cc;
  }
`;
