import styled, { keyframes } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor } from '~type/interface';

const animationOpacity = keyframes`
  0% { opacity: 0; margin-top: 0 }
  100% { opacity: 1; margin-top: 14px }
`;

export const Container = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${InterfaceBackgroundColor.BLUE_TRANSPARENT};
  padding: 20px;
  margin-top: 14px;
  pointer-events: all;
  animation: ${animationOpacity} 0.1s ease-in;
  border-radius: 10px;
  &::after {
    position: absolute;
    content: '';
    top: -14px;
    left: 39px;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 14px solid ${InterfaceBackgroundColor.BLUE_TRANSPARENT};
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 10px;
  }
`;
