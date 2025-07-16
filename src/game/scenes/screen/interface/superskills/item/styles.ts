import styled, { css, keyframes } from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

const animationTimeout = keyframes`
  0% { top: 0 }
  100% { top: 100% }
`;

const animationOpacity = keyframes`
  0% { opacity: 0; margin-bottom: 0 }
  100% { opacity: 1; margin-bottom: 12px }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const Container = styled.div<{
  $active?: boolean
  $allow?: boolean
}>`
  background: var(--color-background-black-50);
  padding: 14px;
  pointer-events: all;
  border-radius: 5px;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    ${(props) => props.$allow && css`
      &:hover {
        cursor: pointer;
        ${() => (!props.$active && css`
          background: var(--color-background-black);
        `)};
      }
    `}
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 10px;
  }
`;

export const Lock = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 5px 6px 5px;
  z-index: 3;
  right: -4px;
  top: -4px;
`;

export const IconLock = styled.img`
  width: 10px;
  height: 10px;
`;

export const IconContainer = styled.div<{
  $allow?: boolean
}>`
  display: block;
  position: relative;
  z-index: 2;
  width: 26px;
  height: 26px;
  ${(props) => !props.$allow && css`
    opacity: 0.5;
  `}
  [role=texture] {
    width: 100%;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 22px;
    height: 22px;
  }
`;

export const Info = styled.div`
  position: absolute;
  transform: translateX(-50%);
  bottom: 100%;
  left: 50%;
  margin-bottom: 12px;
  min-width: 200px;
  animation: ${animationOpacity} 0.1s ease-in;
  &::after {
    position: absolute;
    content: "";
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 12px solid var(--color-background-black-75);
  }
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px 9px 14px;
  background: var(--color-background-black);
  border-radius: 5px 5px 0 0;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 9px 11px;
  }
`;

export const Name = styled.div`
  color: var(--color-text-success);
  font-family: var(--font-pixel-label);
  font-size: 14px;
  line-height: 14px;
  margin: -2px 10px 0 0;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 13px;
    line-height: 13px;
  }
`;

export const Body = styled.div`
  font-family: var(--font-pixel-text);
  letter-spacing: 1px;
  background: var(--color-background-black-75);
  padding: 9px 14px 12px 14px;
  border-radius: 0 0 5px 5px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 7px 11px 11px 11px;
  }
`;

export const Description = styled.div`
  font-size: 11px;
  line-height: 12px;
  color: #fff;
`;

export const Timeout = styled.div`
  position: absolute;
  background: var(--color-background-success-dark);
  inset: 0;
  animation: ${animationTimeout} 1s linear;
  border-radius: 5px;
`;
