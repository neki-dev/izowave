import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceBackgroundColor, InterfaceFont, InterfaceLayer } from '~lib/interface/types';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: all;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${InterfaceLayer.OVERLAY};
`;

export const Groups = styled.div`
  display: flex;
  gap: 20px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 10px;
  }
`;

export const Group = styled.div`
  min-width: 280px;
`;

export const Target = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  font-size: 10px;
  line-height: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  background: ${InterfaceBackgroundColor.SUCCESS_DARK};
  box-shadow: 0 15px 0 ${InterfaceBackgroundColor.SUCCESS} inset;
  border-radius: 5px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const Container = styled.div`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  border-radius: 10px 0 10px 10px;
  padding: 30px;
  position: relative;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 20px;
  }
`;

export const Close = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  color: #fff;
  letter-spacing: 1px;
  font-size: 10px;
  line-height: 10px;
  position: absolute;
  transform: translateY(-100%);
  top: 0;
  right: 0;
  padding: 7px 9px 7px 10px;
  border-radius: 5px 5px 0 0;
  pointer-events: all;
  text-transform: uppercase;
  background: ${InterfaceBackgroundColor.ERROR_DARK};
  opacity: 0.75;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;
