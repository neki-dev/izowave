import styled, { keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

const animationOpacity = keyframes`
  0% { opacity: 0; margin-right: -15px }
  100% { opacity: 1; margin-right: 0 }
`;

export const Wrapper = styled.div`
  width: 260px;
  animation: ${animationOpacity} 0.1s ease-in;
  border-radius: 10px;
  overflow: hidden;
  &::after {
    position: absolute;
    content: '';
    right: 0;
    top: 30px;
    transform: translate(100%, -50%);
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 15px solid ${InterfaceColor.BLUE_BLACK}ee;
  }
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: ${InterfaceColor.BLUE_BLACK}ee;
  height: 59px;
`;

export const Name = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: ${InterfaceColor.INFO};
  font-size: 16px;
  line-height: 16px;
`;

export const Body = styled.div`
  padding: 18px 20px 20px 20px;
  background: ${InterfaceColor.BLUE_DARK}cc;
`;

export const Alert = styled.div<{
  $attention?: boolean
}>`
  margin: 15px 0 -5px 0;
  border-radius: 5px;
  padding: 6px 9px;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 10px;
  line-height: 10px;
  letter-spacing: 1px;
  color: #fff;
  background: ${(props) => (props.$attention
    ? `${InterfaceColor.ERROR_DARK}aa`
    : 'rgba(0, 0, 0, 0.25)'
  )};
`;
