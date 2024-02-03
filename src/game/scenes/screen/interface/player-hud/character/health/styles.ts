import styled from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~lib/interface/types';

export const Container = styled.div`
  background: ${InterfaceBackgroundColor.BLACK};
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

export const Progress = styled.div`
  height: 20px;
  background: ${InterfaceBackgroundColor.SUCCESS_DARK};
  box-shadow: 0 10px 0 ${InterfaceBackgroundColor.SUCCESS} inset;
  transition: width 0.3s ease-out;
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
