import styled, { css } from 'styled-components';

import { InterfaceFont, InterfaceTextColor } from '~type/interface';

export const Wrapper = styled.ul`
  list-style: none;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;

export const Space = styled.div`
  height: 20px;
`;

export const Item = styled.li<{
  $active?: boolean
  $disabled?: boolean
}>`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 18px;
  line-height: 18px;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  ${(props) => (props.$active ? css`
    color: ${InterfaceTextColor.SUCCESS};
    border-color: ${InterfaceTextColor.SUCCESS};
    &:hover {
      cursor: pointer;
    }
  ` : css`
    color: #fff;
    &:hover {
      cursor: pointer;
      color: ${InterfaceTextColor.HOVER};
    }
  `)}
  ${(props) => (props.$disabled ? css`
    opacity: 0.5;
  ` : css`
    pointer-events: all;
  `)}
`;
