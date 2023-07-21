import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  display: flex;
  color: #fff;
`;

export const IconContainer = styled.div`
  background: ${InterfaceColor.BLACK_TRANSPARENT};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

export const Icon = styled.img`
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
