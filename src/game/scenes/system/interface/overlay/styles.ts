import styled from 'styled-components';

import { InterfaceBackgroundColor, InterfaceLayer } from '~lib/interface/types';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: ${InterfaceLayer.OVERLAY};
  pointer-events: all;
  > * {
    pointer-events: none;
  }
`;
