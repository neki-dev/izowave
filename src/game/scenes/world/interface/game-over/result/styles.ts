import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 38px;
  border-radius: 0 0 5px 5px;
  gap: 15px;
  background: var(--color-background-black-25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    gap: 10px;
    padding: 25px 32px;
  }
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-family: var(--font-pixel-label);
`;

export const Value = styled.div`
  font-size: 20px;
  line-height: 20px;
  padding: 4px 8px 7px 8px;
  border-radius: 3px;
  border: 1px solid var(--color-background-white-50);
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 18px;
    line-height: 18px;
  }
`;

export const Label = styled.div`
  margin-left: 10px;
  font-size: 16px;
  line-height: 16px;
  white-space: pre;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 14px;
    line-height: 14px;
  }
`;

export const Record = styled.div`
  margin-left: 15px;
  font-size: 12px;
  line-height: 12px;
  color: var(--color-text-success);
`;
