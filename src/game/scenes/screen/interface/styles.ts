import styled from 'styled-components';

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px;
  display: flex;
  justify-content: space-between;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &.left {
    justify-self: start;
    align-items: flex-start;
  }
  &.center {
    justify-self: center;
    align-items: center;
  }
  &.right {
    justify-self: end;
    align-items: flex-end;
  }
`;
