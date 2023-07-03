import styled, { keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

const animationOpacity = keyframes`
  0% { opacity: 0; margin-right: -15px }
  100% { opacity: 1; margin-right: 0 }
`;

export const Wrapper = styled.div`
  width: 280px;
  background: ${InterfaceColor.BLUE_DARK}cc;
  padding: 20px;
  animation: ${animationOpacity} 0.1s ease-in;
  &::after {
    position: absolute;
    content: '';
    right: 0;
    top: 30px;
    transform: translate(100%, -50%);
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 15px solid ${InterfaceColor.BLUE_DARK}cc;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Name = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  color: ${InterfaceColor.PRIMARY};
  font-size: 18px;
  line-height: 18px;
  text-shadow: 3px 3px 0 #332717;
`;

export const Limit = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 13px;
  line-height: 13px;
  &.attention {
    color: ${InterfaceColor.WARN};
  }
`;

export const Description = styled.div`
  margin-top: 10px;
  color: #fff;
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 14px;
  line-height: 16px;
  text-shadow: 2px 2px 0 #000;
`;

export const Allowance = styled(Description)`
  opacity: 0.75;
`;

export const Cost: any = styled.div`
  margin-top: 10px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.25);
`;
