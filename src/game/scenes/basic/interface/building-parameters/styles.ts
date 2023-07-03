import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Parameters = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
`;

export const Parameter: any = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  padding: 5px;
`;

Parameter.IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

Parameter.Icon = styled.div`
  width: 10px;
  height: 10px;
  background: url(assets/sprites/interface/building.png);
`;

Parameter.Info = styled.div`
  color: #fff;
  &.attention {
    color: ${InterfaceColor.WARN};
  }
`;

Parameter.Label = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 11px;
  line-height: 11px;
  opacity: 0.75;
  margin-top: -2px;
`;

Parameter.Value = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  font-size: 14px;
  line-height: 14px;
`;
