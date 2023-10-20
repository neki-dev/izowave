import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Container = styled.div`
  color: #fff;
  background: ${InterfaceBackgroundColor.ERROR_DARK_TRANSPARENT_75};
  border-radius: 5px;
  display: flex;
  align-items: center;
  pointer-events: all;
  overflow: hidden;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 18px;
  flex: 1;
  &:hover {
    cursor: pointer;
    background: ${InterfaceBackgroundColor.BLACK};
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 14px 16px;
  }
`;

export const Group = styled.div`
`;

export const IconPlay = styled.img`
  width: 40px;
  margin-right: 18px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 32px;
    margin-right: 16px;
  }
`;

export const Label = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 10px;
  line-height: 10px;
  margin-top: -1px;
  white-space: nowrap;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 9px;
    line-height: 9px;
  }
`;

export const Close = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 13px;
  line-height: 13px;
  padding: 0 24px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  height: 100%;
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
    background: ${InterfaceBackgroundColor.ERROR_DARK};
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 0 20px;
  }
`;

export const Amounts = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 10px;
  }
`;

export const Amount: any = styled.div`
  display: flex;
  align-items: center;
`;

Amount.Icon = styled.img`
  margin-right: 8px;
  width: 16px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 12px;
  }
`;

Amount.Value = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 15px;
  line-height: 15px;
  margin-top: -2px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 14px;
    line-height: 14px;
    margin-top: -3px;
  }
`;
