import styled from 'styled-components';

import { InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 4;
  pointer-events: all;
  > * {
    pointer-events: none;
  }
`;
