import styled from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Container = styled.div`
  background: #000;
  position: relative;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
`;

export const Progress = styled.div`
  height: 20px;
  background: ${InterfaceBackgroundColor.SUCCESS};
  box-shadow: 0 10px 0 ${InterfaceBackgroundColor.WHITE_TRANSPARENT_15}inset;
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
