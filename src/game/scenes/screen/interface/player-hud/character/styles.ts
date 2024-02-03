import styled from 'styled-components';

import { InterfaceBackgroundColor } from '~lib/interface/types';

export const Container = styled.div`
  padding: 5px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 5px;
`;

export const Avatar = styled.div`
  width: 74px;
  height: 74px;
`;

export const Image = styled.img`
  width: 100%;
`;
