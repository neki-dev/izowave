import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-background-black-50);
  padding: 0 13px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 6px;
    padding: 0 8px;
  }
`;
