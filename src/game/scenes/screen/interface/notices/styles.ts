import styled, { keyframes } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

const animationOpacity = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Item = styled.div`
  padding: 10px 13px;
  border-radius: 5px;
  color: #fff;
  text-transform: uppercase;
  font-family: var(--font-pixel-text);
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 2px;
  animation: ${animationOpacity} 0.2s ease-in;
  background: var(--color-background-error-75);
  display: flex;
  align-items: center;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 10px;
    line-height: 9px;
    padding: 8px 11px;
  }
`;

export const Icon = styled.img`
  width: 16px;
  margin-right: 10px;
`;
