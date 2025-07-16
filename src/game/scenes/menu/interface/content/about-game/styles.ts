import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Wrapper = styled.div`
  color: #fff;
  font-family: var(--font-pixel-text);
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
