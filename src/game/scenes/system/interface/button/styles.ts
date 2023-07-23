import styled, { css } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Container = styled.div<{
  $active?: boolean
  $size?: 'small' | 'large'
}>`
  background: ${(props) => ((props.$active)
    ? InterfaceColor.BLUE
    : InterfaceColor.BLACK_TRANSPARENT
  )};
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  pointer-events: all;
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
        font-size: 12px;
        line-height: 12px;
        padding: 4px 7px;
      `;
    }
  }}
  &:hover {
    cursor: pointer;
    background: ${InterfaceColor.BLUE_DARK};
  }
`;
