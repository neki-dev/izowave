import styled from 'styled-components';

export const Wrapper = styled.div`
  pointer-events: all;
`;

export const Info: any = styled.div`
  position: absolute;
  transform: translate(-100%, 50%);
  margin: -58px 0 0 -15px;
  display: none;
`;

export const Variant = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  &:hover {
    [role=hint] {
      display: none;
    }
    ${Info} {
      display: block;
    }
  }
`;
