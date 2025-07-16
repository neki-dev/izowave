import styled from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT, INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

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
  font-family: var(--font-pixel-label);
  font-size: 12px;
  line-height: 12px;
  color: var(${(props) => (props.$attention ? '--color-text-error' : '--color-text-white')});
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 10px;
    line-height: 10px;
  }
`;
