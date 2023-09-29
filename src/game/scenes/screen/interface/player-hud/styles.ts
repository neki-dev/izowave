import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';

export const Wrapper = styled.div`
  display: flex;
`;

export const Group = styled.div`
  &:not(:last-child) {
    margin-right: 16px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    &:not(:last-child) {
      margin-right: 12px;
    }
  }
`;

export const Space = styled.div`
  height: 6px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    height: 4px;
  }
`;
