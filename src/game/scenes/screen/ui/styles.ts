import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 32px;
  display: flex;
  justify-content: space-between;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Info = styled.div`
  &> div:not(:last-child) {
    margin-bottom: 32px;
  }
`;

export const Bars = styled.div`
  &> div:not(:last-child) {
    margin-bottom: 8px;
  }
`;
