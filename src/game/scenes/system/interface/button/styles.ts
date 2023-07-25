import styled, { css } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Container = styled.div<{
  $size?: 'small' | 'large'
  $view?: 'active' | 'confirm' | 'decline'
}>`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  pointer-events: all;
  border-radius: 5px;
  letter-spacing: 1px;
  ${(props) => {
    switch (props.$view) {
      case 'active': return css`
        background: ${InterfaceColor.BLUE};
      `;
      case 'confirm': return css`
        background: ${InterfaceColor.INFO_DARK};
      `;
      case 'decline': return css`
        background: ${InterfaceColor.ERROR_DARK};
      `;
      default: return css`
        background: #000;
      `;
    }
  }}
  ${(props) => {
    switch (props.$size) {
      case 'small': return css`
        font-size: 10px;
        line-height: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 24px;
      `;
      case 'large': return css`
        font-size: 22px;
        line-height: 22px;
        padding: 13px 20px 14px 20px;
      `;
      default: return css`
        font-size: 11px;
        line-height: 11px;
        padding: 7px 10px 8px 10px;
      `;
    }
  }}
  &:hover {
    cursor: pointer;
    background: ${InterfaceColor.BLUE_DARK};
  }
`;
