import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

export const Control = styled.div`
  display: flex;
  align-items: center;
`;

export const Keys = styled.div`
  margin-right: 8px;
  display: flex;
  gap: 3px;
`;

export const Key = styled.div`
  color: #444;
  font-family: var(--font-pixel-label);
  font-size: 12px;
  line-height: 12px;
  padding: 4px 7px 5px 7px;
  background: #fff;
  box-shadow: 0 4px 0 #999;
  text-align: center;
  margin-top: -3px;
  border-radius: 3px;
`;

export const Description = styled.div`
  font-family: var(--font-pixel-text);
  font-size: 12px;
  line-height: 13px;
  letter-spacing: 1px;
  color: #fff;
`;
