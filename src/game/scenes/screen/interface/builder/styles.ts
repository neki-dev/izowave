import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-right: -16px;
    padding: 1px 16px 1px 0;
    overflow-y: scroll;
    overflow-x: visible;
    width: 100vw; // hacking overflow-x
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  > *:not(:last-child) {
    margin-bottom: 10px;
    @media ${INTERFACE_MOBILE_BREAKPOINT} {
      margin-bottom: 3px;
    }
  }
`;
