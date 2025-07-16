import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT, INTERFACE_DESKTOP_BREAKPOINT } from '~core/interface/const';

export const Wrapper = styled.div`
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    width: 250px;
    position: absolute;
    transform: translate(-50%, -100%);
    margin-top: -15px;
    &::after {
      position: absolute;
      content: "";
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 100%);
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-top: 15px solid var(--color-background-black-50);
    }
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    pointer-events: all;
    width: 200px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background: var(--color-background-black-75);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

export const Container = styled.div`
  overflow: hidden;
  /* backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transform: translateZ(0);
  -webkit-transform: translateZ(0); */
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    border-radius: 10px;
  }
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--color-background-black);
`;

export const Body = styled.div`
  padding: 16px;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    background: var(--color-background-black-50);
  }
`;

export const Name = styled.div`
  font-family: var(--font-pixel-label);
  color: var(--color-text-success);
  font-size: 14px;
  line-height: 14px;
`;

export const Level: any = styled.div`
  display: flex;
  gap: 5px;
`;

Level.Progress = styled.div<{
  $active?: boolean
}>`
  flex: 1;
  height: 12px;
  transition: all 0.2s ease-out;
  background: var(--color-background-black);
  box-shadow: 0 6px 0 #222 inset;
  ${(props) => props.$active && css`
    background: var(--color-background-success);
    box-shadow: 0 6px 0 var(--color-background-white-15) inset;
  `}
`;

export const Health: any = styled.div`
  background: var(--color-background-black);
  position: relative;
  margin-bottom: 6px;
`;

Health.Progress = styled.div`
  height: 14px;
  background: var(--color-background-error);
  box-shadow: 0 7px 0 var(--color-background-white-15) inset;
  transition: width 0.3s ease-out;
`;

Health.Value = styled.div`
  position: absolute;
  font-family: var(--font-pixel-label);
  color: #fff;
  font-size: 10px;
  line-height: 10px;
  text-shadow: 1px 1px 0 #000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  padding-bottom: 2px;
`;
