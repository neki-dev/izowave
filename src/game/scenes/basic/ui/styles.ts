import styled from 'styled-components';

import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Label = styled.div`
  color: ${INTERFACE_TEXT_COLOR.ERROR_DARK};
  font-family: ${INTERFACE_FONT.PIXEL};
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
  font-family: ${INTERFACE_FONT.PIXEL};
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

Stats.Value = styled.div`
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
  color: ${INTERFACE_TEXT_COLOR.INFO};
  text-shadow: 2px 2px 0 #000;
`;

export const Restart = styled.div`
  margin-top: 70px;
  color: #fff;
  background: ${INTERFACE_TEXT_COLOR.BLUE_DARK};
  font-family: ${INTERFACE_FONT.PIXEL};
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
