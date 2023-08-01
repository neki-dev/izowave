import styled from 'styled-components';

export const Wrapper = styled.div`
  pointer-events: all;
  display: grid;
  grid-gap: 10px;
  @media (max-height: 600px) and (min-width: 1080px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Info = styled.div`
  position: absolute;
  transform: translate(-100%, 50%);
  margin: -58px 0 0 -15px;
  display: none;
  z-index: 2;
`;

export const Variant = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  &:hover {
    [role=hint] {
      display: none;
    }
    ${Info} {
      display: block;
    }
  }
`;
