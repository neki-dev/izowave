import styled from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont, InterfaceLayer } from '~lib/interface/types';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: all;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  z-index: ${InterfaceLayer.OVERLAY};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
`;

export const Container = styled.div`
  position: absolute;
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  position: absolute;
`;

export const Content = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 18px;
  line-height: 20px;
  letter-spacing: 1px;
  color: #fff;
  white-space: pre;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 10px;
`;
