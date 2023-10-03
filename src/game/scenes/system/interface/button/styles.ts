import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

export const Container = styled.div<{
  $size?: 'fixed' | 'small' | 'medium' | 'large'
  $view?: 'active' | 'primary' | 'confirm' | 'decline'
  $disabled?: boolean
}>`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  border-radius: 5px;
  letter-spacing: 1px;
  ${(props) => {
    switch (props.$view) {
      case 'active': return css`
        background: ${InterfaceBackgroundColor.BLUE};
      `;
      case 'primary': return css`
        background: ${InterfaceBackgroundColor.WARN};  
        &:hover {
          background: ${InterfaceBackgroundColor.WARN_DARK};
        }
      `;
      case 'confirm': return css`
        background: ${InterfaceBackgroundColor.SUCCESS};  
        &:hover {
          background: ${InterfaceBackgroundColor.SUCCESS_DARK};
        }
      `;
      case 'decline': return css`
        background: ${InterfaceBackgroundColor.ERROR};
        &:hover {
          background: ${InterfaceBackgroundColor.ERROR_DARK};
        }
      `;
      default: return css`
        background: ${InterfaceBackgroundColor.BLACK};
        &:hover {
          background: ${InterfaceBackgroundColor.BLUE};
        }
      `;
    }
  }}
  ${(props) => {
    switch (props.$size) {
      case 'large': return css`
        font-size: 22px;
        line-height: 22px;
        padding: 13px 20px 14px 20px;
      `;
      case 'medium': return css`
        font-size: 18px;
        line-height: 18px;
        padding: 10px 18px 11px 18px;
      `;
      case 'small': return css`
        font-size: 11px;
        line-height: 11px;
        padding: 7px 10px 8px 10px;
      `;
      default: return css`
        font-size: 10px;
        line-height: 10px;
        text-align: center;
        padding: 6px 0 7px 0;
        @media ${INTERFACE_MOBILE_BREAKPOINT} {
          font-size: 8px;
          line-height: 8px;
          padding: 8px 0 9px 0;
        }
      `;
    }
  }}
  ${(props) => (props.$disabled ? css`
    opacity: 0.25
  ` : css`
    pointer-events: all;
  `)};
  &:hover {
    cursor: pointer;
  }
`;
