import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import {
  InterfaceFont,
  InterfaceTextColor,
  InterfaceBackgroundColor,
} from '~type/interface';

export const Container = styled.div`
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  &:first-child {
    border-radius: 5px 5px 0 0;
  }
  &:last-child {
    border-radius: 0 0 5px 5px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 6px;
  }
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 14px 0 8px;
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

export const Action = styled.div<{
  $active?: boolean
}>`
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  pointer-events: all;
  border-radius: 5px;
  padding: 10px 0;
  ${(props) => props.$active && css`
    background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
    &:hover {
      cursor: pointer;
      background: ${InterfaceBackgroundColor.BLACK};
    }
  `}
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 80px;
    padding: 9px 0;
    background: ${InterfaceBackgroundColor.BLACK};
  }
`;

export const Button = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 10px;
  line-height: 10px;
  margin-bottom: 6px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
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
