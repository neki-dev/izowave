import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 3;
`;

export const Wrapper = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  position: relative;
`;

export const Sidebar = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Logotype = styled.div`
  color: #59aed0;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 46px;
  line-height: 46px;
`;

export const Line = styled.div`
  width: 1px;
  top: -10%;
  bottom: -10%;
  left: 38%;
  background: rgba(255, 255, 255, 0.25);
  position: absolute;
`;
