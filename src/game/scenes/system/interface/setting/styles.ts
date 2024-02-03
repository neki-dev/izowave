import styled, { css } from 'styled-components';

import {
  InterfaceFont,
  InterfaceTextColor,
  InterfaceBackgroundColor,
} from '~lib/interface/types';

export const Wrapper = styled.div`
`;

export const Label = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 14px;
  line-height: 14px;
  margin-bottom: 10px;
`;

export const Values = styled.ul<{
  $disabled?: boolean
}>`
  list-style: none;
  display: flex;
  gap: 5px;
  ${(props) => (props.$disabled ? css`
    opacity: 0.5;
  ` : css`
    pointer-events: all;
  `)}
`;

export const Value = styled.li<{
  $active?: boolean
  $color?: InterfaceTextColor
}>`
  color: ${(props) => (props.$active
    ? (props.$color ?? InterfaceTextColor.SUCCESS)
    : InterfaceBackgroundColor.WHITE_TRANSPARENT_75
  )};
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 14px;
  line-height: 14px;
  border: 1px solid ${(props) => (props.$active
    ? (props.$color ?? InterfaceTextColor.SUCCESS)
    : InterfaceBackgroundColor.WHITE_TRANSPARENT_75
  )};
  padding: 4px 7px 6px 7px;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
    ${(props) => !props.$active && css`
      color: ${InterfaceTextColor.HOVER};
      border-color: ${InterfaceTextColor.HOVER};
    `};
  }
`;
