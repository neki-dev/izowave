import styled from 'styled-components';

import { INTERFACE_FONT } from '~const/interface';

export const Wrapper = styled.div`
  background: #000;
  padding: 2px;
  width: 120px;
  position: relative;
`;

export const Progress = styled.div`
  height: 24px;
`;

export const Value = styled.div`
  position: absolute;
  font-family: ${INTERFACE_FONT.PIXEL};
  color: #fff;
  font-size: 12px;
  line-height: 12px;
  text-shadow: 2px 2px 0 #000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-top: -1px;
`;
