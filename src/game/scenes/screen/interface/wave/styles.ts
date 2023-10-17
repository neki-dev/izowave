import styled, { css, keyframes } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
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
  padding: 10px 16px 10px 10px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px 0 0 5px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 7px 11px 7px 7px;
  }
`;

export const CurrentNumber = styled.div<{
  $paused?: boolean
  $going?: boolean
}>`
  text-align: center;
  border-radius: 3px;
  background: ${(props) => {
    if (props.$paused) {
      return InterfaceBackgroundColor.WARN;
    }
    if (props.$going) {
      return InterfaceBackgroundColor.ERROR;
    }

    return InterfaceBackgroundColor.SUCCESS;
  }};
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    font-size: 24px;
    line-height: 24px;
    padding: 6px 12px 10px 12px;
    min-width: 40px;
    box-shadow: 0 20px 0 ${InterfaceBackgroundColor.WHITE_TRANSPARENT_15} inset;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 22px;
    line-height: 22px;
    padding: 4px 13px 7px 13px;
    box-shadow: 0 16px 0 ${InterfaceBackgroundColor.WHITE_TRANSPARENT_15} inset;
  }
`;

export const State = styled.div`
  margin-left: 10px;
`;

export const Label = styled.div`
  font-size: 11px;
  line-height: 11px;
  opacity: 0.5;
  margin-top: -2px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
    opacity: 0.75;
  }
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
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 18px;
    line-height: 18px;
  }
`;
