import styled from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Container = styled.div`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  position: relative;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  padding: 5px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

export const Progress = styled.div`
  height: 20px;
  background: ${InterfaceBackgroundColor.SUCCESS_DARK};
  box-shadow: 0 10px 0 ${InterfaceBackgroundColor.SUCCESS} inset;
  transition: width 0.3s ease-out;
  border-radius: 3px;
`;

export const Value = styled.div`
  position: absolute;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  font-size: 10px;
  line-height: 10px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  padding-bottom: 1px;
`;
