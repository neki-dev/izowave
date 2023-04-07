import styled from 'styled-components';

import { InterfaceScreenSize } from '~type/interface';

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  @media ${InterfaceScreenSize.M} {
    zoom: 0.9;
  }
  @media ${InterfaceScreenSize.S} {
    zoom: 0.8;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

export const HUD: any = styled.div`
  &> div:not(:last-child) {
    margin-bottom: 32px;
  }
`;

HUD.Bars = styled.div`
  &> div:not(:last-child) {
    margin-bottom: 8px;
  }
`;
