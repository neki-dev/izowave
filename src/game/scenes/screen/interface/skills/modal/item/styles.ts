import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import {
  InterfaceFont,
  InterfaceTextColor,
  InterfaceBackgroundColor,
} from '~type/interface';

export const Container = styled.div<{
  $active?: boolean
}>`
  color: #fff;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  ${(props) => props.$active && css`
    &:hover {
      cursor: pointer;
      background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
    }
  `}
  &:first-child {
    border-radius: 5px 5px 0 0;
  }
  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 15px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 11px 12px;
  }
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  font-size: 12px;
  line-height: 12px;
  margin-right: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 11px;
    line-height: 11px;
  }
`;

export const Level: any = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 2px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-top: 8px;
  }
`;

Level.Progress = styled.div<{
  $active?: boolean
}>`
  flex: 1;
  height: 8px;
  transition: all 0.2s ease-out;
  background: ${InterfaceBackgroundColor.BLACK};
  box-shadow: 0 4px 0 #111 inset;
  ${(props) => props.$active && css`
    background: ${InterfaceBackgroundColor.SUCCESS};
    box-shadow: 0 4px 0 ${InterfaceBackgroundColor.WHITE_TRANSPARENT_15} inset;
  `}
`;

export const Action = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  padding: 10px 0;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 86px;
  }
`;

export const Button = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 8px;
  line-height: 8px;
  letter-spacing: 1px;
  margin-bottom: 6px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 7px;
    line-height: 7px;
  }
`;

export const Limit = styled.div`
  color: ${InterfaceTextColor.WARN};
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  white-space: pre;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 10px;
  }
`;
