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

export const Info = styled.div`
  width: 300px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.25);
  flex: 1;
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  color: ${InterfaceColor.INFO};
  font-size: 14px;
  line-height: 14px;
`;

export const Description = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  color: #fff;
  margin-top: 4px;
  font-weight: bold;
`;

export const Level = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  margin-top: 6px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 3px 5px;
  display: inline-block;
`;

export const Action = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  &.active {
    background: rgba(0, 0, 0, 0.5);
    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.75);
    }
  }
`;

export const Button = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  font-size: 10px;
  line-height: 10px;
  margin-bottom: 10px;
`;

export const Limit = styled.div`
  color: ${InterfaceColor.WARN};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 10px;
  line-height: 12px;
  text-align: center;
`;
