import styled from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Label = styled.div`
  background: ${InterfaceColor.ERROR_DARK};
  color: #fff;
  padding: 15px 30px 20px 30px;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 66px;
  line-height: 66px;
`;
