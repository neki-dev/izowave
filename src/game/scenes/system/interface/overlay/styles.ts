import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 3;
  pointer-events: all;
  > * {
    pointer-events: none;
  }
`;
