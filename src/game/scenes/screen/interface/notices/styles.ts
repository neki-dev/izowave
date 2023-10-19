import styled, { keyframes } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';
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
  gap: 8px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    top: 80px;
  }
`;

export const Item = styled.div<{
  $type: NoticeType
}>`
  padding: 8px 13px 9px 13px;
  border-radius: 5px;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 13px;
  line-height: 13px;
  letter-spacing: 1px;
  animation: ${animationOpacity} 0.2s ease-in;
  background: ${(props) => InterfaceBackgroundColor[props.$type]};
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 11px;
    line-height: 11px;
    padding: 7px 11px 8px 11px;
  }
`;
