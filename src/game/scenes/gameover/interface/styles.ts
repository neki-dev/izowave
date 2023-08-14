import styled from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Label = styled.div`
  background: ${InterfaceBackgroundColor.ERROR};
  color: #fff;
  padding: 15px 30px 24px 30px;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 66px;
  line-height: 66px;
`;
