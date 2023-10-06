import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

export const Placeholder = styled.div`
  position: absolute;
  pointer-events: none;
  display: none;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  font-size: 12px;
  line-height: 32px;
  height: 32px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  border-radius: 5px;
  padding: 0 12px;
`;

export const Wrapper = styled.div`
  position: relative;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  font-family: ${InterfaceFont.PIXEL_LABEL};
  display: flex;
  color: #fff;
  border-radius: 5px;
  pointer-events: all;
  &:hover {
    ${Placeholder} {
      display: block;
    }
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
  font-size: 16px;
  line-height: 16px;
  height: 32px;
  padding: 0 13px 0 9px;
  display: flex;
  align-items: center;
  flex: 1;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    height: 28px;
    font-size: 15px;
    line-height: 15px;
    padding: 0 9px 0 6px;
  }
`;
