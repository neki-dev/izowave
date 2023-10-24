import styled, { css } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

export const Container = styled.div<{
  $allow?: boolean
  $active?: boolean
  $usable?: boolean
}>`
  border-radius: 5px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  position: relative;
  ${(props) => (props.$allow ? css`
    ${() => (!props.$usable && css`
      background: ${InterfaceBackgroundColor.ERROR_DARK_TRANSPARENT_75};
    `)}
  ` : css`
      opacity: 0.35;
      filter: grayscale(100%);
  `)}
  ${(props) => (props.$active && css`
    opacity: 1.0;
    background: ${InterfaceBackgroundColor.BLACK};
  `)}
  [role=hint]:not(.hidden) + &{
    box-shadow: 0 0 50px 20px #fff;
  }
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    &:hover {
      border-radius: 0 5px 5px 0;
      cursor: pointer;
    }
  }
`;

export const Image = styled.div`
  position: relative;
  z-index: 2;
  padding: 10px 10px 7px 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 8px 10px 5px 10px;
  }
`;

export const Frame = styled.div`
  overflow: hidden;
  width: 34px;
  height: 40px;
  [role=texture] {
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
