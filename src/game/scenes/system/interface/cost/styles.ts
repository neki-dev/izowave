import styled from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceFont, InterfaceTextColor } from '~lib/interface/types';

export const Wrapper = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
`;

export const Icon = styled.img`
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    width: 12px;
    margin-right: 5px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 10px;
    margin-right: 4px;
  }
`;

export const Value = styled.div<{
  $attention?: boolean
}>`
  margin-top: -2px;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 12px;
  line-height: 12px;
  color: ${(props) => (props.$attention ? InterfaceTextColor.ERROR : '#fff')};
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 10px;
    line-height: 10px;
  }
`;
