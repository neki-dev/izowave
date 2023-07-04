import styled from 'styled-components';

import { InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  display: flex;
  color: #fff;
  align-items: center;
`;

export const Icon: any = styled.div`
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

Icon.Image = styled.img`
  width: 16px;
`;

export const State: any = styled.div`
  margin-left: 10px;
`;

State.Label = styled.div`
  font-size: 10px;
  line-height: 10px;
  opacity: 0.75;
  margin-top: -2px;
  text-shadow: 1px 1px 0 #000;
`;

State.Amount = styled.div`
  margin-top: 3px;
  font-size: 16px;
  line-height: 16px;
  text-shadow: 2px 2px 0 #000;
`;
