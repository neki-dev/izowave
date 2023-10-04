import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT, INTERFACE_DESKTOP_BREAKPOINT } from '~const/interface';

export const Info = styled.div<{
  $visible?: boolean
}>`
  position: absolute;
  left: 0;
  top: 0;
  transform: translateX(-100%);
  margin-left: -15px;
  z-index: 2;
  display: none;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-left: -2px;
    height: 100%;
    ${(props) => props.$visible && css`
      display: block;
      + [role=hint] {
        display: none;
      }
    `}
  }
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  pointer-events: all;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    &:hover {
      ${Info} {
        display: block;
        + [role=hint] {
          display: none;
        }
      }
    }
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    height: 100%;
  }
`;
