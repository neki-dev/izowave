import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceFont, InterfaceTextColor } from '~lib/interface/types';

export const Wrapper = styled.ul`
  list-style: none;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

export const Space = styled.div`
  height: 12px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    height: 6px;
  }
`;

export const Item = styled.li<{
  $active?: boolean
  $disabled?: boolean
}>`
  position: relative;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 20px;
  line-height: 20px;
  padding-right: 12px;
  white-space: nowrap;
  &:after {
    position: absolute;
    content: "";
    right: 0;
    top: 50%;
    transform: translateY(-7px);
    width: 2px;
    height: 16px;
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
    font-size: 18px;
    line-height: 18px;
    &:after {
      transform: translateY(-6px);
      height: 14px;
    }
  }
`;
