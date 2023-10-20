import styled, { css } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Label = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  letter-spacing: 1px;
  white-space: nowrap;
  font-size: 11px;
  line-height: 11px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 13px;
    line-height: 13px;
  }
`;

export const Addon = styled.div`
  transform: scale(0.9);
  margin: 0 -2px -1px 6px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    transform: scale(1.25);
    margin: 0 2px -1px 6px;
  }
`;

export const Main = styled.div`
  display: flex;
  align-items: center;
`;

export const Key = styled.div`
  padding: 1px 2px 1px 3px;
  margin: 0 8px 0 -3px;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 9px;
  line-height: 9px;
  color: #fff;
  border: 1px solid #ffffffaa;
  background: ${InterfaceBackgroundColor.BLACK};
  border-radius: 2px;
`;

export const Container = styled.div<{
  $disabled?: boolean
}>`
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    transform: translateX(-50%);
    padding: 6px 9px;
    ${(props) => (props.$disabled ? css`
      background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
      ${Label}, ${Addon}, ${Key} {
        opacity: 0.7;
      }
    ` : css`
      background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
      &:hover {
        cursor: pointer;
        background: ${InterfaceBackgroundColor.BLACK};
      }
    `)}
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    background: ${InterfaceBackgroundColor.BLACK};
    padding: 14px 15px;
    ${(props) => (props.$disabled && css`
      background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
      ${Label}, ${Addon} {
        opacity: 0.5;
      }
    `)}
  }
`;
