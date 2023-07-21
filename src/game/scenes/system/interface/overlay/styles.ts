import styled from 'styled-components';

import { InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${InterfaceColor.BLACK_TRANSPARENT};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 3;
  pointer-events: all;
  > * {
    pointer-events: none;
  }
`;
