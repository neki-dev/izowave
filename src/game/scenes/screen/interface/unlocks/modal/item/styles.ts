import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Container = styled.div`
  overflow: hidden;
  width: 220px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  display: flex;
  flex-direction: column;
`;

export const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  background: var(--color-background-black-25);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    height: 100px;
  }
`;

export const Info = styled.div`
  background: var(--color-background-black-50);
  padding: 16px 20px;
  flex: 1;
`;

export const Type = styled.div`
  color: #fff;
  font-family: var(--font-pixel-text);
  font-size: 10px;
  line-height: 10px;
  opacity: 0.5;
`;

export const Name = styled.div`
  color: var(--color-text-success);
  font-family: var(--font-pixel-label);
  font-size: 14px;
  line-height: 14px;
  margin-top: 5px;
`;

export const Description = styled.div`
  color: #fff;
  font-family: var(--font-pixel-text);
  font-size: 10px;
  line-height: 10px;
  margin-top: 5px;
`;

export const IconContainer = styled.div<{
  $type: 'BUILDING' | 'SUPERSKILL' | 'ASSISTANT'
}>`
  overflow: hidden;
  ${(props) => {
    switch (props.$type) {
      case 'BUILDING': return css`
        width: 68px;
        height: 80px;
        [role=texture] {
          height: 100%;
        }
      `;
      case 'SUPERSKILL': return css`
        width: 64px;
        height: 64px;
        [role=texture] {
          width: 100%;
        }
      `;
      case 'ASSISTANT': return css`
        width: 48px;
        height: 80px;
        [role=texture] {
          height: 96px;
        }
      `;
    }
  }}
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    transform: scale(0.75);
  }
`;
