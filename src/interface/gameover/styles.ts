import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Label = styled.div`
  color: ${InterfaceColor.ERROR_DARK};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 66px;
  line-height: 66px;
  text-shadow: 8px 8px 0 #000;
`;

export const Stats: any = styled.div`
  margin-top: 60px;
  list-style: none;
`;

Stats.Item = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

Stats.Value = styled.div`
  margin-top: -3px;
  font-size: 26px;
  line-height: 26px;
  text-shadow: 4px 4px 0 #000;
`;

Stats.Label = styled.div`
  margin-left: 10px;
  font-size: 16px;
  line-height: 16px;
  text-shadow: 3px 3px 0 #000;
`;

Stats.Record = styled.div`
  margin-left: 15px;
  font-size: 12px;
  line-height: 12px;
  color: ${InterfaceColor.INFO};
  text-shadow: 2px 2px 0 #000;
`;

export const Restart = styled.div`
  margin-top: 70px;
  color: #fff;
  background: ${InterfaceColor.BLUE_DARK};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 22px;
  line-height: 22px;
  text-shadow: 2px 2px 0 #000;
  padding: 8px 13px 9px 13px;
  pointer-events: all;
  &:hover {
    cursor: pointer;
    background: #000;
  }
`;
