import styled, { css } from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Placeholder = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  color: #fff;
  position: absolute;
  pointer-events: none;
  letter-spacing: 1px;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  line-height: 10px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  border-radius: 0 5px 5px 0;
  padding: 8px 12px 8px 9px;
  height: 36px;
  white-space: pre;
  display: none;
  align-items: center;
`;

export const Icon = styled.img`
  width: 16px;
`;

export const Container = styled.div<{
  $active?: boolean
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 5px;
  pointer-events: all;
  ${(props) => (props.$active ? css`
    outline: 3px solid ${InterfaceBackgroundColor.WARN};
    background: ${InterfaceBackgroundColor.BLACK};
  ` : css`
    background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  `)};
  &:hover {
    border-radius: 5px 0 0 5px;
    background: ${InterfaceBackgroundColor.BLACK};
    cursor: pointer;
    ${Placeholder} {
      display: flex;
    }
  }
`;
