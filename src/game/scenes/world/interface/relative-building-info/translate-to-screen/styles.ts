import styled from 'styled-components';

import { InterfaceLayer } from '~type/interface';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  z-index: ${InterfaceLayer.TRANSLATOR};
`;
