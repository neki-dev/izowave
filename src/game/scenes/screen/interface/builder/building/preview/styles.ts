import styled, { css, keyframes } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

const animationBlink = keyframes`
  0% { background: ${InterfaceBackgroundColor.SUCCESS}; }
  50% { background: ${InterfaceBackgroundColor.SUCCESS_DARK}; }
  100% { background: ${InterfaceBackgroundColor.SUCCESS}; }
`;

export const Container = styled.div<{
  $disabled?: boolean
  $disallow?: boolean
  $active?: boolean
  $usable?: boolean
}>`
  padding: 11px 18px 11px 14px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    right: 3px;
    top: 3px;
    bottom: 3px;
    background: ${InterfaceBackgroundColor.ERROR_LIGHT};
    border-radius: 2px;
    width: 3px;
  }
  ${(props) => (!props.$disabled && css`
    &:hover {
      background: ${InterfaceBackgroundColor.BLACK};
      cursor: pointer;
    }
  `)}
  ${(props) => ((props.$disabled || props.$disallow) && css`
    opacity: 0.5;
    filter: grayscale(100%);
    &::before {
      background: #aaa;
    }
  `)}
  ${(props) => (props.$usable && css`
    &::before {
      background: ${InterfaceBackgroundColor.SUCCESS_LIGHT};
    }
  `)}
  ${(props) => (props.$active && css`
    opacity: 1.0;
    background: ${InterfaceBackgroundColor.BLUE};
    &:hover {
      background: ${InterfaceBackgroundColor.BLUE};
    }
  `)}
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    display: flex;
    align-items: center;
    padding: 8px 16px 8px 12px;
    height: 100%;
  }
`;

export const Preview = styled.div`
  overflow: hidden;
  width: 34px;
  height: 40px;
  img, div[data-texture-container] {
    height: 100%;
  }
`;

export const Newest = styled.div`
  position: absolute;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 9px;
  line-height: 9px;
  left: -3px;
  top: -3px;
  border-radius: 5px;
  background: ${InterfaceBackgroundColor.SUCCESS};
  padding: 2px 4px 3px 4px;
  animation: ${animationBlink} 1s infinite;
`;

export const Number = styled.div`
  position: absolute;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 10px;
  line-height: 10px;
  right: 10px;
  top: 4px;
  opacity: 0.75;
`;
