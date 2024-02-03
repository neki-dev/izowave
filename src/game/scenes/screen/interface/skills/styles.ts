import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceBackgroundColor } from '~lib/interface/types';

export const Wrapper = styled.div`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 13px;
  border-radius: 0 5px 5px 0;
  > [role=button] {
    padding: 0 14px;
    height: 36px;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 0 8px;
    > [role=button] {
      height: 32px;
    }
  }
`;
