import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';

export const Wrapper = styled.div`
  display: flex;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-bottom: 6px;
  }
`;
