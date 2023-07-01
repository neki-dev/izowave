import styled from 'styled-components';

import { InterfaceColor, InterfaceFont, InterfaceScreenSize } from '~type/interface';

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${InterfaceScreenSize.M} {
    zoom: 0.9;
  }
  @media ${InterfaceScreenSize.S} {
    zoom: 0.8;
  }
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
  padding: 8px 13px 9px 13px;
  pointer-events: all;
  &:hover {
    cursor: pointer;
    background: #000;
  }
`;
