import styled from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    margin-top: 50px;
    position: absolute;
    left: 50%;
    gap: 3px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 0 16px 14px 16px;
    gap: 5px;
  }
`;
