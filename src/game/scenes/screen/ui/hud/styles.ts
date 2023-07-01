import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
`;

export const Column = styled.div`
  &:not(:last-child) {
    margin-right: 16px;
  }
  > div:not(:last-child) {
    margin-bottom: 10px;
  }
`;
