import styled, { css } from 'styled-components';

import { InterfaceFont, InterfaceTextColor } from '~type/interface';

export const Wrapper = styled.ul`
  list-style: none;
  text-align: right;
  pointer-events: all;
  display: flex;
`;

export const Item = styled.li<{
  $active?: boolean
}>`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 24px;
  line-height: 24px;
  padding-bottom: 7px;
  border-bottom: 4px solid transparent;
  ${(props) => (props.$active
    ? css`
      color: ${InterfaceTextColor.SUCCESS};
      border-color: ${InterfaceTextColor.SUCCESS};
      &:hover {
        cursor: pointer;
      }
    `
    : css`
      color: #fff;
      &:hover {
        cursor: pointer;
        color: ${InterfaceTextColor.HOVER};
      }
    `
  )}
  &:not(:last-child) {
    margin-right: 30px;
  }
`;
