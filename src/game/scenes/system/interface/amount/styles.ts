import styled from 'styled-components';

import { InterfaceFont, InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  font-family: ${InterfaceFont.PIXEL_LABEL};
  display: flex;
  color: #fff;
  border-radius: 5px;
  overflow: hidden;
`;

export const IconContainer = styled.div`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  border-radius: 0 5px 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

export const Icon = styled.img`
  width: 16px;
`;

export const Value = styled.div`
  font-size: 16px;
  line-height: 16px;
  height: 32px;
  padding: 0 13px 0 9px;
  display: flex;
  align-items: center;
  flex: 1;
`;
