import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  display: flex;
  color: #fff;
`;

export const Icon: any = styled.div`
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

Icon.Image = styled.img`
  width: 16px;
`;

export const Value = styled.div`
  background: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  line-height: 16px;
  height: 32px;
  padding: 0 9px;
  display: flex;
  align-items: center;
  flex: 1;
`;
