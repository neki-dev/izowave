import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Container = styled.div`
  background: #000;
  padding: 2px;
  width: 130px;
  position: relative;
`;

export const Progress = styled.div`
  height: 24px;
  background: #e4372c;
`;

export const Value = styled.div`
  position: absolute;
  font-family: ${InterfaceFont.PIXEL};
  color: #fff;
  font-size: 12px;
  line-height: 12px;
  text-shadow: 2px 2px 0 #000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-top: -1px;
`;
