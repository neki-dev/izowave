import styled, { css } from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import {
  InterfaceFont,
  InterfaceBackgroundColor,
  InterfaceTextColor,
} from '~type/interface';

export const Wrapper = styled.div<{
  $adaptive?: boolean
}>`
  margin-top: 15px;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(2, 1fr);
  ${(props) => (props.$adaptive && css`
    @media ${INTERFACE_MOBILE_BREAKPOINT} {
      grid-template-columns: 1fr;
    }
  `)};
`;

export const Param = styled.div`
  display: flex;
  align-items: center;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  border-radius: 5px;
  overflow: hidden;
`;

export const IconContainer = styled.div`
  width: 34px;
  height: 34px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 5px 5px 0;
`;

export const Icon = styled.img`
  width: 15px;
  height: 15px;
`;

export const Info = styled.div<{
  $attention?: boolean
}>`
  padding: 2px 5px;
  color: ${(props) => (props.$attention
    ? InterfaceTextColor.WARN
    : '#fff'
  )};
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 10px;
  line-height: 10px;
  opacity: 0.75;
  margin: -1px 0 2px 0;
`;

export const Value = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 12px;
  line-height: 12px;
`;
