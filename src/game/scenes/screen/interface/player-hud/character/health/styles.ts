import styled from 'styled-components';

export const Container = styled.div`
  background: var(--color-background-black);
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

export const Progress = styled.div`
  height: 20px;
  background: var(--color-background-success-dark);
  box-shadow: 0 10px 0 var(--color-background-success) inset;
  transition: width 0.3s ease-out;
`;

export const Value = styled.div`
  position: absolute;
  font-family: var(--font-pixel-label);
  color: #fff;
  font-size: 10px;
  line-height: 10px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  padding-bottom: 1px;
`;
