import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Item = styled.div`
  color: #fff;
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

export const Info: any = styled.div`
  width: 300px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.25);
  flex: 1;
`;

Info.Label = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  font-size: 14px;
  line-height: 14px;
  color: ${InterfaceColor.ACTIVE};
`;

Info.Description = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4px;
`;

Info.Value = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  margin-top: 4px;
`;

export const Action: any = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  background: rgba(0, 0, 0, 0.35);
  &.active {
    background: rgba(0, 0, 0, 0.5);
    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.75);
    }
  }
`;

Action.Button = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  font-size: 10px;
  line-height: 10px;
  margin-bottom: 10px;
`;

Action.Experience = styled.div`

`;

Action.Limit = styled.div`
  color: ${InterfaceColor.WARN};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 10px;
  line-height: 12px;
  text-align: center;
`;
