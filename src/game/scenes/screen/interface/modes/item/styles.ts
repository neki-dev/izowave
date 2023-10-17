import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Placeholder = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  color: #fff;
  position: absolute;
  pointer-events: none;
  letter-spacing: 1px;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  font-size: 10px;
  line-height: 12px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
  padding: 9px 12px;
  margin-top: 20px;
  white-space: pre;
  display: none;
  &::after {
    position: absolute;
    content: '';
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  }
`;

export const Icon = styled.img`
  width: 16px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 12px;
  }
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
    background: ${InterfaceBackgroundColor.SUCCESS};
  ` : css`
    background: ${InterfaceBackgroundColor.BLACK};
  `)};
  &:hover {
    ${(props) => (!props.$active && css`
      background: ${InterfaceBackgroundColor.SUCCESS_DARK};
    `)};
    cursor: pointer;
    ${Placeholder} {
      display: block;
    }
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 32px;
    height: 32px;
  }
`;
