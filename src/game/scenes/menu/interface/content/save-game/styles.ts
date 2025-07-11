import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 300px;
  margin-bottom: 30px;
  background: var(--color-background-black-50);
  color: #fff;
  font-size: 14px;
  line-height: 14px;
  border-radius: 5px;
  padding: 12px 16px;
  pointer-events: all;
  border: none;
  &:focus {
    outline: 1px solid var(--color-background-success-dark);
  }
`;

export const Limit = styled.div`
  width: 100%;
  color: var(--color-text-warn);
  font-family: var(--font-pixel-text);
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 30px;
  padding: 14px 16px;
  background: var(--color-background-black-50);
  border-radius: 5px;
  letter-spacing: 1px;
`;
