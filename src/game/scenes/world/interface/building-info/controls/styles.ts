import styled, { css } from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 80px;
  position: absolute;
  left: 50%;
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
  padding: 6px 9px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  transform: translateX(-50%);
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
`;
