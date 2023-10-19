import styled from 'styled-components';

import { InterfaceBackgroundColor } from '~type/interface';

export const Container = styled.div`
  width: 78px;
  height: 78px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px 5px 0 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

export const Image = styled.img`
  width: 100%;
`;
