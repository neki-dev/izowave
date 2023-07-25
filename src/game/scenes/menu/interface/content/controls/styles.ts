import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Control = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

export const Keys = styled.div`
  margin-right: 8px;
  display: flex;
`;

export const Key = styled.div`
  color: #000;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 13px;
  line-height: 13px;
  padding: 3px 7px 4px 7px;
  background: #fff;
  text-align: center;
  border-radius: 3px;
  &:not(:last-child) {
    margin-right: 3px;
  }
`;
