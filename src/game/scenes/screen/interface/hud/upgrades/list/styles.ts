import styled from 'styled-components';

import { InterfaceColor } from '~type/interface';

export const Container = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${InterfaceColor.BLUE_DARK}cc;
  padding: 20px;
  margin-top: 20px;
  &::after {
    position: absolute;
    content: '';
    top: -14px;
    left: 39px;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 14px solid ${InterfaceColor.BLUE_DARK}cc;
  }
`;
