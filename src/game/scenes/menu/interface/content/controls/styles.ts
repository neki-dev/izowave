import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Control: any = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

Control.Keys = styled.div`
  margin-right: 10px;
  display: flex;
`;

Control.Key = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 17px;
  line-height: 17px;
  padding: 4px 8px 6px 8px;
  border: 1px solid #fff;
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
