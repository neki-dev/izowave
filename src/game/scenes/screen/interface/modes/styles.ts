import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceBackgroundColor } from '~lib/interface/types';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  padding: 0 13px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 6px;
    padding: 0 8px;
  }
`;
