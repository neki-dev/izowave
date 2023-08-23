import styled from 'styled-components';

import { InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
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
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 15vh 7vw;
`;

export const Logotype = styled.img`
  height: 50px;
  margin-bottom: 50px;
`;
