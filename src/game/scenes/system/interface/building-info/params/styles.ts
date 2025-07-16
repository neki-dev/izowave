import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

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
  background: var(--color-background-black-50);
  border-radius: 5px;
  overflow: hidden;
`;

export const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  background: var(--color-background-black-75);
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
  color: var(${(props) => (props.$attention
    ? '--color-text-warn'
    : '--color-text-white'
  )});
`;

export const Label = styled.div`
  font-family: var(--font-pixel-text);
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
  font-family: var(--font-pixel-label);
  font-size: 11px;
  line-height: 11px;
`;
