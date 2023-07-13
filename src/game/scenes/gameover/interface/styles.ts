import styled from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Label = styled.div`
  color: ${InterfaceColor.ERROR_DARK};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 66px;
  line-height: 66px;
  text-shadow: 8px 8px 0 #000;
`;

export const Restart = styled.div`
  margin-top: 70px;
  color: #fff;
  background: ${InterfaceColor.BLUE_DARK};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 22px;
  line-height: 22px;
  text-shadow: 2px 2px 0 #000;
  padding: 13px 20px 14px 20px;
  pointer-events: all;
  &:hover {
    cursor: pointer;
    background: #000;
  }
`;
