import styled from 'styled-components';

import { InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Input = styled.input`
  width: 100%;
  margin-bottom: 30px;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  color: #fff;
  border-radius: 5px;
  padding: 12px 16px;
  pointer-events: all;
  border: none;
  &:focus {
    outline: 1px solid ${InterfaceBackgroundColor.SUCCESS_DARK};
  }
`;
