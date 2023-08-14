import styled, { css } from 'styled-components';

import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

export const Container = styled.div<{
  $size?: 'fixed' | 'small' | 'medium' | 'large'
  $view?: 'active' | 'primary' | 'confirm' | 'decline'
}>`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  pointer-events: all;
  border-radius: 5px;
  letter-spacing: 1px;
  ${(props) => {
    switch (props.$view) {
      case 'active': return css`
        background: ${InterfaceBackgroundColor.BLUE};
        &:hover {
          cursor: pointer;
        }
      `;
      case 'primary': return css`
        background: ${InterfaceBackgroundColor.WARN};  
        &:hover {
          cursor: pointer;
          background: ${InterfaceBackgroundColor.WARN_DARK};
        }
      `;
      case 'confirm': return css`
        background: ${InterfaceBackgroundColor.SUCCESS};  
        &:hover {
          cursor: pointer;
          background: ${InterfaceBackgroundColor.SUCCESS_DARK};
        }
      `;
      case 'decline': return css`
        background: ${InterfaceBackgroundColor.ERROR};
        &:hover {
          cursor: pointer;
          background: ${InterfaceBackgroundColor.ERROR_DARK};
        }
      `;
      default: return css`
        background: ${InterfaceBackgroundColor.BLACK};
        &:hover {
          cursor: pointer;
          background: ${InterfaceBackgroundColor.BLUE};
        }
      `;
    }
  }}
  ${(props) => {
    switch (props.$size) {
      case 'fixed': return css`
        text-align: center;
        font-size: 10px;
        line-height: 24px;
        width: 80px;
      `;
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
      case 'small':
      default: return css`
        font-size: 11px;
        line-height: 11px;
        padding: 7px 10px 8px 10px;
      `;
    }
  }}
`;
