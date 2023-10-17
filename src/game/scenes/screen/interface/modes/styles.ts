import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  padding: 0 13px;
  border-radius: 0 5px 5px 0;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 6px;
    padding: 0 8px;
  }
`;
