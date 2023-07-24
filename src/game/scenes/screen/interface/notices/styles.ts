import styled, { keyframes } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';
import { NoticeType } from '~type/screen';

const animationOpacity = keyframes`
  0% { opacity: 0; margin-top: -32px }
  100% { opacity: 1; margin-top: 0 }
`;

export const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 128px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

export const Item = styled.div<{
  $type: NoticeType
}>`
  padding: 8px 15px 9px 15px;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 16px;
  line-height: 16px;
  animation: ${animationOpacity} 0.2s ease-in;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  background: ${(props) => {
    switch (props.$type) {
      case NoticeType.WARN: return InterfaceColor.WARN_DARK;
      case NoticeType.ERROR: return InterfaceColor.ERROR_DARK;
      default: return InterfaceColor.BLUE;
    }
  }}
`;
