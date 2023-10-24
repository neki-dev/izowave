import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont, InterfaceTextColor } from '~type/interface';

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
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    height: 100px;
  }
`;

export const Info = styled.div`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  padding: 16px 20px;
  flex: 1;
`;

export const Type = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 10px;
  line-height: 10px;
  opacity: 0.5;
`;

export const Name = styled.div`
  color: ${InterfaceTextColor.SUCCESS};
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 14px;
  line-height: 14px;
  margin-top: 5px;
`;

export const Description = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 10px;
  line-height: 10px;
  margin-top: 5px;
`;

export const IconContainer = styled.div<{
  $type: 'BUILDING' | 'SUPERSKILL'
}>`
  overflow: hidden;
  ${(props) => (props.$type === 'BUILDING' ? css`
    width: 68px;
    height: 80px;
    [role=texture] {
      height: 100%;
    }
  ` : css`
    width: 64px;
    height: 64px;
    [role=texture] {
      width: 100%;
    }
  `)}
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    ${(props) => (props.$type === 'BUILDING' ? css`
      width: 46px;
      height: 54px;
    ` : css`
      width: 46px;
      height: 46px;
    `)}
  }
`;
