import styled, { css, keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

const animationPulse = keyframes`
  0% { transform: scale(0.8) }
  100% { transform: scale(1.0) }
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
  background: ${InterfaceColor.BLACK_TRANSPARENT};
`;

export const CurrentNumber = styled.div<{
  $going?: boolean
}>`
  font-size: 24px;
  line-height: 24px;
  padding: 6px 17px 10px 17px;
  background: ${(props) => (props.$going
    ? InterfaceColor.ERROR_DARK
    : InterfaceColor.INFO_DARK
  )};
  box-shadow: 0 20px 0 rgba(255, 255, 255, 0.15) inset;
`;

export const State = styled.div`
  margin-left: 10px;
`;

export const Label = styled.div`
  font-size: 11px;
  line-height: 11px;
  opacity: 0.5;
  margin-top: -1px;
`;

export const Value = styled.div<{
  $attention?: boolean
}>`
  margin-top: 3px;
  font-size: 20px;
  line-height: 20px;
  ${(props) => (props.$attention && css`
    color: ${InterfaceColor.ERROR};
    animation: ${animationPulse} 1s infinite;
  `)}
`;
