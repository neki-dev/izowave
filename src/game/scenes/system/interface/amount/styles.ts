import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceFont, InterfaceBackgroundColor } from '~lib/interface/types';

export const Placeholder = styled.div`
  position: absolute;
  pointer-events: none;
  display: none;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  font-size: 11px;
  line-height: 11px;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  height: 32px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  border-radius: 0 5px 5px 0;
  padding: 0 12px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 9px;
    line-height: 9px;
    height: 28px;
    padding: 0 8px;
  }
`;

export const Wrapper = styled.div`
  position: relative;
  pointer-events: all;
  &:hover ${Placeholder} {
    display: flex;
  }
`;

export const Container = styled.div`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  display: flex;
  border-radius: 5px;
  &:hover {
    border-radius: 5px 0 0 5px;
  }
`;

export const IconContainer = styled.div`
  pointer-events: none;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 28px;
    height: 28px;
  }
`;

export const Icon = styled.img`
  width: 16px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 14px;
  }
`;

export const Value = styled.div`
  pointer-events: none;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  margin-top: -1px;
  font-size: 16px;
  line-height: 16px;
  padding: 0 13px 0 9px;
  display: flex;
  align-items: center;
  flex: 1;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 15px;
    line-height: 15px;
    padding: 0 9px 0 6px;
  }
`;
