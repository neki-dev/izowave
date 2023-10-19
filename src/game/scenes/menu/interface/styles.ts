import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  inset: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
`;

export const Sidebar = styled.div`
  min-width: 30%;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
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
