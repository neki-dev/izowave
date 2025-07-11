import styled, { css, keyframes } from 'styled-components';

const align = {
  'top-left': { transform: 'translate(0, 0)', left: '39px', right: 'auto' },
  'top-center': { transform: 'translate(-50%, 0)', left: '50%', right: 'auto' },
  'top-right': { transform: 'translate(100%, 0)', left: 'auto', right: '39px' },
  'bottom-left': { transform: 'translate(0, -100%)', left: '39px', right: 'auto' },
  'bottom-center': { transform: 'translate(-50%, -100%)', left: '50%', right: 'auto' },
  'bottom-right': { transform: 'translate(100%, -100%)', left: 'auto', right: '39px' },
};

const animationKickLeft = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(10px, 0) }
  100% { transform: translate(0, 0) }
`;

const animationKickRight = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(-10px, 0) }
  100% { transform: translate(0, 0) }
`;

const animationKickTop = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(0, 10px) }
  100% { transform: translate(0, 0) }
`;

const animationKickBottom = keyframes`
  0% { transform: translate(0, 0) }
  50% { transform: translate(0, -10px) }
  100% { transform: translate(0, 0) }
`;

export const Wrapper = styled.div`
  position: relative;
  pointer-events: none;
  z-index: var(--layer-hint);
  &.hidden {
    display: none;
  }
`;

export const Key = styled.span`
  display: inline-block;
  padding: 1px 2px 1px 3px;
  margin-right: 1px;
  font-size: 11px;
  line-height: 11px;
  color: #000;
  background: #fff;
  border-radius: 3px;
`;

export const Container = styled.div`
  background: var(--color-background-black);
  padding: 9px 12px 10px 12px;
  border-radius: 5px;
  color: #fff;
  font-family: var(--font-pixel-text);
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 1px;
  white-space: pre;
  &::after {
    position: absolute;
    content: '';
  }
`;

export const Positioner = styled.div<{
  $side: 'left' | 'right' | 'top' | 'bottom'
  $align: 'left' | 'center' | 'right'
}>`
  position: absolute;
  ${(props) => {
    switch (props.$side) {
      case 'left': return css`
        padding-left: 10px;
        transform: translate(0, -50%);
        ${Container} {
          animation: ${animationKickLeft} 1s infinite;
          &::after {
            left: 0;
            top: 50%;
            transform: translate(-100%, -50%);
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-right: 10px solid var(--color-background-black);
          }
        }
      `;
      case 'right': return css`
        padding-right: 10px;
        transform: translate(-100%, -50%);
        ${Container} {
          animation: ${animationKickRight} 1s infinite;
          &::after {
            right: 0;
            top: 50%;
            transform: translate(100%, -50%);
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 10px solid var(--color-background-black);
          }
        }
      `;
      case 'top': return css`
        padding-top: 10px;
        transform: ${align[`top-${props.$align}`].transform};
        ${Container} {
          animation: ${animationKickTop} 1s infinite;
          &::after {
            top: 0;
            left: ${align[`top-${props.$align}`].left};
            right: ${align[`top-${props.$align}`].right};
            transform: translate(-50%, -100%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 10px solid var(--color-background-black);
          }
        }
      `;
      case 'bottom': return css`
        padding-bottom: 10px;
        transform: ${align[`bottom-${props.$align}`].transform};
        ${Container} {
          animation: ${animationKickBottom} 1s infinite;
          &::after {
            bottom: 0;
            left: ${align[`bottom-${props.$align}`].left};
            right: ${align[`bottom-${props.$align}`].right};
            transform: translate(-50%, 100%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 10px solid var(--color-background-black);
          }
        }
      `;
    }
  }}
`;
