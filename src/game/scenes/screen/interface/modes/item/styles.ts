import styled, { css } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Placeholder = styled.div`
  font-family: var(--font-pixel-text);
  color: #fff;
  position: absolute;
  pointer-events: none;
  letter-spacing: 1px;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  font-size: 10px;
  line-height: 12px;
  background: var(--color-background-black-75);
  border-radius: 5px;
  padding: 9px 12px;
  margin-top: 20px;
  white-space: pre;
  z-index: 2;
  &::after {
    position: absolute;
    content: '';
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid var(--color-background-black-75);
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
  background: var(${(props) => (props.$active
    ? '--color-background-success'
    : '--color-background-black'
  )});
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    &:hover {
      cursor: pointer;
      ${(props) => (!props.$active && css`
        background: var(--color-background-success-gradient);
      `)};
    }
    [role=texture] {
      width: 16px;
      height: 16px;
    }
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 32px;
    height: 32px;
    [role=texture] {
      width: 12px;
      height: 12px;
    }
  }
`;
