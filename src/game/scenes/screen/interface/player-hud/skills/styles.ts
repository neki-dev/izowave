import styled, { keyframes } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT, INTERFACE_DESKTOP_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  position: relative;
`;

const animationOpacity = keyframes`
  0% { opacity: 0; margin-top: 0 }
  100% { opacity: 1; margin-top: 14px }
`;

export const Targets = styled.div`
  display: flex;
  margin-bottom: 15px;
  gap: 5px;
  > * {
    flex: 1;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const Container = styled.div`
  pointer-events: all;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    position: absolute;
    top: 100%;
    left: 0;
    background: ${InterfaceBackgroundColor.BLUE_TRANSPARENT};
    animation: ${animationOpacity} 0.1s ease-in;
    border-radius: 10px;
    padding: 20px;
    margin-top: 14px;
    width: 340px;
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
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 320px;
    padding: 16px;
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    z-index: 3;
    background: ${InterfaceBackgroundColor.BLUE};
    display: flex;
    flex-direction: column;
    box-shadow: 10px 0 20px rgba(0, 0, 0, 0.35);
  }
`;
