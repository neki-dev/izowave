import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

export const Container = styled.div<{
  $size?: 'small' | 'large'
  $view?: 'primary' | 'confirm' | 'decline'
  $disabled?: boolean
}>`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  border-radius: 5px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => {
    switch (props.$view) {
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
          background: ${InterfaceBackgroundColor.SUCCESS_DARK};
        }
      `;
    }
  }}
  ${(props) => {
    switch (props.$size) {
      case 'large': return css`
        font-size: 18px;
        line-height: 18px;
        padding: 8px 18px 11px 18px;
      `;
      case 'small': return css`
        font-size: 13px;
        line-height: 13px;
        padding: 9px 14px 12px 14px;
      `;
      default: return css`
        font-size: 10px;
        line-height: 10px;
        padding: 6px 0 7px 0;
        @media ${INTERFACE_MOBILE_BREAKPOINT} {
          font-size: 8px;
          line-height: 8px;
          padding: 11px 0 12px 0;
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
