import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import {
  InterfaceFont,
  InterfaceBackgroundColor,
  InterfaceTextColor,
} from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 15px;
  display: grid;
  grid-gap: 3px;
  grid-template-columns: repeat(2, 1fr);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    grid-template-columns: 1fr;
  }
`;

export const Param = styled.div`
  display: flex;
  align-items: center;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  border-radius: 5px;
  overflow: hidden;
`;

export const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  flex-shrink: 0;
  [role=texture] {
    width: 15px;
    height: 15px;
  }
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
  font-size: 9px;
  line-height: 9px;
  opacity: 0.75;
  margin: -1px 0 3px 0;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
    margin: -2px 0 3px 0;
  }
`;

export const Value = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 11px;
  line-height: 11px;
`;
