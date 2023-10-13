import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Backdrop = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  inset: 0;
  z-index: 4;
  pointer-events: all;
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
