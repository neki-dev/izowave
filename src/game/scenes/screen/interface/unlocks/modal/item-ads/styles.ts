import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Container = styled.div`
  width: 220px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  pointer-events: all;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  overflow: hidden;
  &:hover {
    cursor: pointer;
    background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  }
`;

export const Body = styled.div`
  background: rgba(67, 0, 143, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    height: 100px;
  }
`;

export const IconPlay = styled.img`
  width: 32px;
  margin-right: 10px;
`;

export const IconAdd = styled.img`
  width: 40px;
  margin: 10px 0;
  opacity: 0.5;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 30px;
  }
`;

export const Text = styled.div`
  background: rgba(67, 0, 143, 0.5);
  padding: 20px 30px;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 11px;
  line-height: 11px;
  flex: 1;
  display: flex;
  align-items: center;
`;
