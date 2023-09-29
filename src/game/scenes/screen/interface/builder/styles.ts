import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';

export const Wrapper = styled.div`
  pointer-events: all;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    grid-gap: 2px;
  }
`;

export const Info = styled.div`
  position: absolute;
  transform: translate(-100%, 50%);
  margin: -58px 0 0 -15px;
  display: none;
  z-index: 2;
`;

export const Variant = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  &:hover {
    [role=hint] {
      display: none;
    }
    ${Info} {
      display: block;
    }
  }
`;
