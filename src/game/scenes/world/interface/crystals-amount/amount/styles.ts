import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor } from '~type/interface';

export const Container = styled.div`
  display: inline-block;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
  padding: 6px 8px;
  transform: translate(-50%, 100%);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 5px 6px;
  }
`;
