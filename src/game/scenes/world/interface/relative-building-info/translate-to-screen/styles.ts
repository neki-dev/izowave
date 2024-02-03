import styled from 'styled-components';

import { InterfaceLayer } from '~lib/interface/types';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  z-index: ${InterfaceLayer.TRANSLATOR};
`;
