import styled, { css, keyframes } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

const animationBlink = keyframes`
  0% { background: ${InterfaceBackgroundColor.SUCCESS}; }
  50% { background: ${InterfaceBackgroundColor.SUCCESS_DARK}; }
  100% { background: ${InterfaceBackgroundColor.SUCCESS}; }
`;

export const Container = styled.div<{
  $allow?: boolean
  $active?: boolean
  $usable?: boolean
  $glow?: boolean
}>`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
  position: relative;
  ${(props) => (props.$allow ? css`
    ${() => (!props.$usable && css`
      background: ${InterfaceBackgroundColor.ERROR_DARK_TRANSPARENT_75};
    `)}
  ` : css`
      opacity: 0.5;
      filter: grayscale(100%);
  `)}
  ${(props) => (props.$active && css`
    opacity: 1.0;
    background: ${InterfaceBackgroundColor.BLUE};
    &:hover {
      background: ${InterfaceBackgroundColor.BLUE};
    }
  `)}
  ${(props) => (props.$glow && css`
    box-shadow: 0 0 50px 20px #fff;
  `)}
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    &:hover {
      border-radius: 0 5px 5px 0;
      cursor: pointer;
    }
  }
`;

export const Image = styled.div`
  padding: 10px 10px 7px 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 8px 10px 5px 10px;
  }
`;

export const Frame = styled.div`
  overflow: hidden;
  width: 34px;
  height: 40px;
  img, div[data-texture-container] {
    height: 100%;
  }
`;

export const Info = styled.div`
  background: #000;
  display: flex;
  justify-content: center;
  padding: 5px 0;
  border-radius: 0 0 5px 5px;
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
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
  }
`;

export const Number = styled.div`
  position: absolute;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 10px;
  line-height: 10px;
  right: 4px;
  top: 4px;
  opacity: 0.75;
`;
