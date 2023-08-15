import styled, { css, keyframes } from 'styled-components';

import {
  InterfaceFont,
  InterfaceTextColor,
  InterfaceBackgroundColor,
} from '~type/interface';

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
  font-family: ${InterfaceFont.PIXEL_LABEL};
  display: flex;
  color: #fff;
  align-items: center;
  padding: 10px 15px 10px 10px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
`;

export const CurrentNumber = styled.div<{
  $going?: boolean
}>`
  font-size: 24px;
  line-height: 24px;
  padding: 6px 17px 10px 17px;
  border-radius: 3px;
  background: ${(props) => (props.$going
    ? InterfaceBackgroundColor.ERROR
    : InterfaceBackgroundColor.SUCCESS
  )};
  box-shadow: 0 20px 0 ${InterfaceBackgroundColor.WHITE_TRANSPARENT_15} inset;
`;

export const State = styled.div`
  margin-left: 10px;
`;

export const Label = styled.div`
  font-size: 11px;
  line-height: 11px;
  opacity: 0.5;
  margin-top: -2px;
`;

export const Value = styled.div<{
  $attention?: boolean
}>`
  margin-top: 3px;
  font-size: 20px;
  line-height: 20px;
  ${(props) => props.$attention && css`
    color: ${InterfaceTextColor.ERROR};
    animation: ${animationPulse} 1s infinite;
  `}
`;
