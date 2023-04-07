import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Cost: any = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  &.small {
    zoom: 0.75;
  }
`;

Cost.Label = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 13px;
  line-height: 13px;
  margin: -1px 10px 0 0;
`;

Cost.Icon = styled.img`
  width: 16px;
  margin-right: 5px;
`;

Cost.Value = styled.div`
  margin-top: -2px;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 14px;
  line-height: 14px;
  &.attention {
    color: ${InterfaceColor.ERROR};
  }
`;
