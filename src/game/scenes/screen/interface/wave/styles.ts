import styled, { css, keyframes } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

const animationBlinkColor = keyframes`
  0% { color: var(--color-text-error) }
  100% { color: #fff }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Placeholder = styled.div`
  font-family: var(--font-pixel-text);
  color: #fff;
  position: absolute;
  pointer-events: none;
  letter-spacing: 1px;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  font-size: 10px;
  line-height: 12px;
  background: var(--color-background-black-75);
  border-radius: 5px;
  padding: 9px 12px;
  margin-top: 8px;
  white-space: pre;
  display: none;
  text-align: left;
  &::after {
    position: absolute;
    content: '';
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid var(--color-background-black-75);
  }
`;

export const Container = styled.div<{
  $skippable?: boolean
}>`
  position: relative;
  pointer-events: all;
  font-family: var(--font-pixel-label);
  display: flex;
  color: #fff;
  align-items: center;
  padding: 10px 16px 10px 10px;
  background: var(--color-background-black-75);
  border-radius: 5px 0 0 5px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 7px 11px 7px 7px;
  }
  ${(props) => props.$skippable && css`
    &:hover {
      background: var(--color-background-black);
      cursor: pointer;
      ${Placeholder} {
        display: block;
      }
    }
  `}
`;

export const CurrentNumber = styled.div<{
  $paused?: boolean
  $going?: boolean
}>`
  text-align: center;
  border-radius: 3px;
  background: var(${(props) => {
    if (props.$paused) {
      return '--color-background-warn';
    }
    if (props.$going) {
      return '--color-background-error';
    }

    return '--color-background-success';
  }});
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    font-size: 24px;
    line-height: 24px;
    padding: 6px 12px 10px 12px;
    min-width: 40px;
    box-shadow: 0 20px 0 var(--color-background-white-15) inset;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 22px;
    line-height: 22px;
    padding: 4px 13px 7px 13px;
    box-shadow: 0 16px 0 var(--color-background-white-15) inset;
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
  min-width: 80px;
  white-space: nowrap;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
    opacity: 0.75;
    margin-top: -1px;
  }
`;

export const Value = styled.div<{
  $attention?: boolean
}>`
  margin-top: 3px;
  font-size: 20px;
  line-height: 20px;
  ${(props) => props.$attention && css`
    animation: ${animationBlinkColor} 1s infinite;
  `}
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-top: 1px;
    font-size: 18px;
    line-height: 18px;
  }
`;
