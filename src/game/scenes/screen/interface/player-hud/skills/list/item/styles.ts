import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import {
  InterfaceFont,
  InterfaceTextColor,
  InterfaceBackgroundColor,
} from '~type/interface';

export const Item = styled.div`
  color: #fff;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  overflow: hidden;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

export const Info = styled.div`
  padding: 10px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  flex: 1;
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: ${InterfaceTextColor.SUCCESS};
  font-size: 14px;
  line-height: 14px;
  margin: 0 10px 4px 0;
  white-space: nowrap;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 12px;
    line-height: 12px;
  }
`;

export const Description = styled.div`
  margin: 0 10px 6px 0;
  white-space: nowrap;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    display: none;
  }
`;

export const Level = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 9px;
  line-height: 9px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  padding: 3px 5px;
  display: inline-flex;
  align-items: center;
  b {
    font-size: 12px;
    line-height: 12px;
    margin-left: 5px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
  }
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
  ${(props) => props.$active && css`
    background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
    &:hover {
      cursor: pointer;
      background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
    }
  `}
`;

export const Button = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 10px;
  line-height: 10px;
  margin-bottom: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
  }
`;

export const Limit = styled.div`
  color: ${InterfaceTextColor.WARN};
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  white-space: pre;
`;
