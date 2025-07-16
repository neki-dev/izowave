import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Container = styled.div`
  display: inline-block;
  background: var(--color-background-black-75);
  border-radius: 5px;
  padding: 6px 8px;
  transform: translate(-50%, -50%);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 5px 6px;
  }
`;
