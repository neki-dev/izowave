import styled from 'styled-components';

import { InterfaceScreenSize } from '~type/interface';

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  @media ${InterfaceScreenSize.M} {
    zoom: 0.9;
  }
  @media ${InterfaceScreenSize.S} {
    zoom: 0.8;
  }
`;
