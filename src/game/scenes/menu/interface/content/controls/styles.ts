import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Control = styled.div`
  display: flex;
  align-items: center;
`;

export const Keys = styled.div`
  margin-right: 8px;
  display: flex;
  gap: 3px;
`;

export const Key = styled.div`
  color: #000;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 13px;
  line-height: 13px;
  padding: 4px 7px 5px 7px;
  background: #fff;
  text-align: center;
  border-radius: 3px;
`;
