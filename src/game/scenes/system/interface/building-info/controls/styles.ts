import styled from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    margin-top: 50px;
    position: absolute;
    left: 50%;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 0 16px 14px 16px;
  }
`;
