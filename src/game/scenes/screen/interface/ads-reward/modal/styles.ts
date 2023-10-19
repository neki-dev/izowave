import styled from 'styled-components';

import { InterfaceFont, InterfaceLayer } from '~type/interface';

export const Overlay = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  inset: 0;
  z-index: ${InterfaceLayer.OVERLAY};
  pointer-events: all;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

export const Container = styled.div`
  position: absolute;
  color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 25px;
  gap: 15px;
`;

export const Text = styled.div`
  white-space: pre;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 1px;
`;

export const Amounts = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 15px;
`;
