import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceFont } from '~lib/interface/types';

export const Wrapper = styled.div`
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 15px;
  line-height: 22px;
  letter-spacing: 1px;
  white-space: pre-wrap;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 13px;
    line-height: 18px;
    width: 80%;
  }
`;
