import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
`;

export const Group = styled.div`
  &:not(:last-child) {
    margin-right: 16px;
  }
`;

export const Space = styled.div`
  height: 6px;
`;
