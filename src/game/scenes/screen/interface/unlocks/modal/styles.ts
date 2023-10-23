import styled, { keyframes } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import {
  InterfaceBackgroundColor, InterfaceFont, InterfaceLayer,
} from '~type/interface';

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
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  z-index: ${InterfaceLayer.OVERLAY};
  animation: ${animationOpacity} 0.2s ease-in;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 20px;
  }
`;

export const Label = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 26px;
  line-height: 32px;
  white-space: pre;
  text-align: center;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 18px;
    line-height: 22px;
  }
`;

export const List = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.div`
  pointer-events: all;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  border-radius: 5px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${InterfaceBackgroundColor.SUCCESS_GRADIENT};  
  font-size: 18px;
  line-height: 18px;
  padding: 20px 25px;
  &:hover {
    cursor: pointer;
    background: ${InterfaceBackgroundColor.SUCCESS};
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 14px;
    line-height: 14px;
    padding: 15px 20px;
  }
`;
