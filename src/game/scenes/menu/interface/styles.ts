import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  inset: 0;
`;

export const Sidebar = styled.div`
  min-width: 30%;
  background: var(--color-background-black-25);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  flex: 1;
  padding: 15vh 7vw;
  flex-grow: 0;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 13vh 7vw;
    min-width: 35%;
  }
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 15vh 7vw;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 13vh 7vw;
  }
`;

export const Logotype = styled.img`
  height: 50px;
  margin-bottom: 50px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-bottom: 30px;
  }
`;
