import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Control: any = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

Control.Keys = styled.div`
  margin-right: 8px;
  display: flex;
`;

Control.Key = styled.div`
  color: #000;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 15px;
  line-height: 15px;
  padding: 4px 8px 6px 8px;
  background: #fff;
  min-width: 28px;
  text-align: center;
  &:not(:last-child) {
    margin-right: 3px;
  }
`;

Control.Description = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 14px;
  line-height: 14px;
  text-shadow: 3px 3px 0 #000;
`;
