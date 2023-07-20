import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 60px;
  list-style: none;
`;

export const Item: any = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

Item.Value = styled.div`
  margin-top: -3px;
  font-size: 26px;
  line-height: 26px;
`;

Item.Label = styled.div`
  margin-left: 10px;
  font-size: 16px;
  line-height: 16px;
`;

Item.Record = styled.div`
  margin-left: 15px;
  font-size: 12px;
  line-height: 12px;
  color: ${InterfaceColor.INFO};
`;
