import styled, { css } from 'styled-components';

import {
  InterfaceFont,
  InterfaceTextColor,
  InterfaceBackgroundColor,
} from '~type/interface';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Label = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 18px;
  line-height: 18px;
  margin-right: 15px;
`;

export const Values = styled.ul<{
  $disabled?: boolean
}>`
  list-style: none;
  display: flex;
  ${(props) => (props.$disabled ? css`
    opacity: 0.5;
  ` : css`
    pointer-events: all;
  `)}
`;

export const Value = styled.li<{
  $active?: boolean
}>`
  color: ${(props) => (props.$active
    ? InterfaceTextColor.SUCCESS
    : InterfaceBackgroundColor.WHITE_TRANSPARENT_75
  )};
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 14px;
  line-height: 14px;
  border: 1px solid ${(props) => (props.$active
    ? InterfaceTextColor.SUCCESS
    : InterfaceBackgroundColor.WHITE_TRANSPARENT_75
  )};
  padding: 4px 7px 6px 7px;
  border-radius: 3px;
  &:not(:last-child) {
    margin-right: 5px;
  }
  &:hover {
    cursor: pointer;
    ${(props) => !props.$active && css`
      color: ${InterfaceTextColor.HOVER};
      border-color: ${InterfaceTextColor.HOVER};
    `};
  }
`;
