import styled from 'styled-components';

import { INTERFACE_FONT } from '~const/interface';

export const Wrapper = styled.div`
  font-family: ${INTERFACE_FONT.PIXEL};
  display: flex;
  color: #fff;
`;

export const Icon = styled.img`
`;

export const State: any = styled.div`
  margin-left: 10px;
`;

State.Label = styled.div`
  font-size: 11px;
  line-height: 11px;
  opacity: 0.5;
  margin-top: -2px;
  text-shadow: 2px 2px 0 #000;
`;

State.Amount = styled.div`
  margin-top: 3px;
  font-size: 20px;
  line-height: 20px;
  text-shadow: 3px 3px 0 #000;
`;
