import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT, INTERFACE_DESKTOP_BREAKPOINT } from '~const/interface';

export const Wrapper = styled.div`
  pointer-events: all;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    grid-gap: 2px;
  }
`;

export const Info = styled.div<{
  $visible?: boolean
}>`
  position: absolute;
  transform: translate(-100%, 50%);
  margin: -58px 0 0 -15px;
  z-index: 2;
  display: none;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    ${(props) => props.$visible && css`
      display: block;
      margin-left: -2px;
      + [role=hint] {
        display: none;
      }
    `}
  }
`;

export const Variant = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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
`;
