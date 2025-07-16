import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: var(--color-background-black-75);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: var(--layer-overlay);
  pointer-events: all;
  > * {
    pointer-events: none;
  }
`;
