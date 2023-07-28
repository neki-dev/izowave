import styled from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

export const Container = styled.div`
  background: #000;
  width: 80px;
  position: relative;
`;

export const Progress = styled.div`
  height: 20px;
  background: ${InterfaceColor.INFO_DARK};
  box-shadow: 0 10px 0 rgba(255, 255, 255, 0.15) inset;
  transition: width 0.3s ease-out;
`;

export const Value = styled.div`
  position: absolute;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  font-size: 11px;
  line-height: 11px;
  text-shadow: 1px 1px 0 #000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  padding-bottom: 1px;
`;
