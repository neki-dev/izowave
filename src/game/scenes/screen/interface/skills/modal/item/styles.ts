import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import {
  InterfaceFont,
  InterfaceTextColor,
  InterfaceBackgroundColor,
} from '~lib/interface/types';

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
  align-items: center;
`;

export const Icon = styled.div`
  width: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  margin-right: 1px;
  [role=texture] {
    width: 24px;
    height: 24px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 48px;
    [role=texture] {
      width: 20px;
      height: 20px;
    }
  }
`;

export const Head = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  padding: 12px 13px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 10px;
  }
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  font-size: 12px;
  line-height: 12px;
  margin-right: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 10px;
    line-height: 10px;
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
  margin-left: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  width: 95px;
  padding: 10px 15px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 85px;
    padding: 10px 12px;
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
