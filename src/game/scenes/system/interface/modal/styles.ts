import styled from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Container = styled.div`
  position: absolute;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_75};
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  position: absolute;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
`;

export const Content = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 13px;
  line-height: 17px;
  letter-spacing: 1px;
  color: #fff;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 15px;
  > div:not(:last-child) {
    margin-right: 10px;
  }
`;
