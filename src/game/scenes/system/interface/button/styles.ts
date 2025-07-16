import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Container = styled.div<{
  $size?: 'small' | 'large'
  $view?: 'primary' | 'confirm' | 'decline'
  $disabled?: boolean
}>`
  color: #fff;
  font-family: var(--font-pixel-label);
  border-radius: 5px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => {
    switch (props.$view) {
      case 'primary': return css`
        background: var(--color-background-warn-gradient);  
        &:hover {
          background: var(--color-background-warn);
        }
      `;
      case 'confirm': return css`
        background: var(--color-background-success-gradient);  
        &:hover {
          background: var(--color-background-success);
        }
      `;
      case 'decline': return css`
        background: var(--color-background-error-gradient);
        &:hover {
          background: var(--color-background-error);
        }
      `;
      default: return css`
        background: var(--color-background-black);
        &:hover {
          background: var(--color-background-success-gradient);
        }
      `;
    }
  }}
  ${(props) => {
    switch (props.$size) {
      case 'large': return css`
        font-size: 17px;
        line-height: 17px;
        padding: 11px 18px 14px 18px;
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
