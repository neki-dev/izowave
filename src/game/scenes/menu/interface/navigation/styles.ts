import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceTextColor } from '~type/interface';

export const Wrapper = styled.ul`
  list-style: none;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

export const Space = styled.div`
  height: 20px;
`;

export const Item = styled.li<{
  $active?: boolean
  $disabled?: boolean
}>`
  position: relative;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 18px;
  line-height: 18px;
  padding-right: 26px;
  white-space: nowrap;
  &:after {
    position: absolute;
    content: "";
    right: 0;
    top: 50%;
    margin-top: -5px;
    width: 10px;
    height: 10px;
    background: #fff;
  }
  ${(props) => (props.$active ? css`
    color: ${InterfaceTextColor.SUCCESS};
    &:after {
      background: ${InterfaceTextColor.SUCCESS};
    }
    &:hover {
      cursor: pointer;
    }
  ` : css`
    color: #fff;
    &:hover {
      cursor: pointer;
      color: ${InterfaceTextColor.HOVER};
      &:after {
        background: ${InterfaceTextColor.HOVER};
      }
    }
  `)}
  ${(props) => (props.$disabled ? css`
    opacity: 0.5;
  ` : css`
    pointer-events: all;
  `)}
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    &:after {
      margin-top: -3px;
    }
  }
`;
