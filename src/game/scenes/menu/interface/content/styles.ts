import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  width: 54%;
`;

export const Title = styled.div`
  color: #fff;
  opacity: 0.5;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 46px;
  line-height: 46px;
  text-transform: uppercase;
`;

export const Body = styled.div`
  margin-top: 70px;
`;
