import styled, { css, keyframes } from 'styled-components';

import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

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

export const Container = styled.div<{
  $width?: number
}>`
  box-shadow: 0 0 90px 20px #fff;
  background: ${InterfaceBackgroundColor.BLACK};
  padding: 9px 12px 10px 12px;
  border-radius: 5px;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 1px;
  white-space: pre;
  width: ${(props) => (props.$width
    ? `${props.$width}px`
    : 'auto'
  )};
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
            border-right: 10px solid ${InterfaceBackgroundColor.BLACK};
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
            border-left: 10px solid ${InterfaceBackgroundColor.BLACK};
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
            border-bottom: 10px solid ${InterfaceBackgroundColor.BLACK};
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
            border-top: 10px solid ${InterfaceBackgroundColor.BLACK};
          }
        }
      `;
    }
  }}
`;
