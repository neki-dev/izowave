import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div<{
  $hidden?: boolean
}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${(props) => props.$hidden && css`
    display: none;
  `}
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 13px;
  }
`;

export const Category = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  letter-spacing: 1px;
  font-size: 9px;
  line-height: 9px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  padding: 3px 5px 4px 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-bottom: 5px;
  }
`;

export const Variants = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 2px;
  }
`;
