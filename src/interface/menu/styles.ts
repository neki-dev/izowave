import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  position: relative;
  pointer-events: none;
`;

export const Sidebar = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Logotype = styled.div`
  color: ${InterfaceColor.BLUE};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 46px;
  line-height: 46px;
  text-shadow: 6px 6px 0 #000;
`;

export const Menu: any = styled.ul`
  margin-top: 70px;
  list-style: none;
  text-align: right;
  pointer-events: all;
`;

Menu.Item = styled.li`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 22px;
  line-height: 22px;
  text-shadow: 4px 4px 0 #000;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  &:hover {
    cursor: pointer;
    color: ${InterfaceColor.PRIMARY};
  }
  &.active {
    color: ${InterfaceColor.ACTIVE};
  }
`;

export const Copyright = styled.div`
  margin-top: 100px;
  color: rgba(255, 255, 255, 0.5);
  font-family: ${InterfaceFont.MONOSPACE};
  white-space: pre-line;
  text-align: right;
`;

export const Line = styled.div`
  width: 1px;
  top: -10%;
  bottom: -10%;
  left: 38%;
  background: rgba(255, 255, 255, 0.25);
  position: absolute;
`;

export const Content: any = styled.div`
  width: 54%;
`;

Content.Title = styled.div`
  color: #fff;
  opacity: 0.3;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 46px;
  line-height: 46px;
  text-shadow: 6px 6px 0 #000;
  text-transform: uppercase;
`;

Content.Wrapper = styled.div`
  margin-top: 70px;
`;
