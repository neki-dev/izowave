import styled, { css } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    margin-top: 80px;
    position: absolute;
    left: 50%;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 0 16px 14px 16px;
  }
`;

export const Label = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 11px;
  line-height: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const Addon = styled.div`
  margin: 1px 0 0 6px;
`;

export const Action = styled.div<{
  $disabled?: boolean
}>`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  ${(props) => props.$disabled && css`
    ${Label}, ${Addon} {
      opacity: 0.7;
    }
  `}
  &:not(:last-child) {
    margin-bottom: 3px;
  }
  &:hover {
    cursor: pointer;
    background: ${InterfaceBackgroundColor.BLACK};
  }
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    transform: translateX(-50%);
    padding: 6px 9px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 9px 14px;
  }
`;
