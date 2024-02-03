import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceBackgroundColor } from '~lib/interface/types';

export const Container = styled.div`
  display: inline-block;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
  padding: 6px 8px;
  transform: translate(-50%, -50%);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 5px 6px;
  }
`;
