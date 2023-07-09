import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Control: any = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

Control.Keys = styled.div`
  margin-right: 8px;
  display: flex;
`;

Control.Key = styled.div`
  color: #000;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 13px;
  line-height: 13px;
  padding: 3px 7px 4px 7px;
  background: #fff;
  text-align: center;
  &:not(:last-child) {
    margin-right: 3px;
  }
`;

Control.Description = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 11px;
  line-height: 11px;
  text-shadow: 2px 2px 0 #000;
`;
