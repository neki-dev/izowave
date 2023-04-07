import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Control: any = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

Control.Keys = styled.div`
  color: #fff;
  background: ${InterfaceColor.BLUE_DARK};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 18px;
  line-height: 18px;
  padding: 4px 8px;
  margin-right: 10px;
`;

Control.Description = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 14px;
  line-height: 14px;
  text-shadow: 3px 3px 0 #000;
`;
