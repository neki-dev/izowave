import styled, { keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

const animationPulse = keyframes`
  0% { transform: scale(0.8) }
  100% { transform: scale(1.0) }
`;

export const Empty = styled.div`
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Container = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  display: flex;
  color: #fff;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.75);
`;

export const CurrentNumber = styled.div`
  font-size: 24px;
  line-height: 24px;
  padding: 6px 17px 10px 17px;
  background: ${InterfaceColor.INFO_DARK};
  box-shadow: 0 20px 0 rgba(255, 255, 255, 0.15) inset;
  &.going {
    background: ${InterfaceColor.ERROR_DARK};
  }
`;

export const State: any = styled.div`
  margin-left: 10px;
`;

State.Label = styled.div`
  font-size: 11px;
  line-height: 11px;
  opacity: 0.5;
  margin-top: -1px;
`;

State.Value = styled.div`
  margin-top: 3px;
  font-size: 20px;
  line-height: 20px;
  &.alarm {
    color: ${InterfaceColor.ERROR};
    animation: ${animationPulse} 1s infinite;
  }
`;

State.Action = styled.div`
  margin-top: 8px;
  font-size: 12px;
  line-height: 12px;
  background: ${InterfaceColor.BLUE_DARK};
  padding: 5px 0;
  text-align: center;
  pointer-events: all;
  &:hover {
    cursor: pointer;
    background: #000;
  }
`;
