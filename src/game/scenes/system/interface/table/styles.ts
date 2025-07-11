import styled, { css } from 'styled-components';

export const Table: any = styled.table`
  width: 100%;
  margin-bottom: 30px;
  color: #fff;
  font-family: var(--font-pixel-text);
  border-collapse: separate; 
  border-spacing: 1px 3px;
`;

Table.Head = styled.thead`
  top: 0;
  font-size: 14px;
  line-height: 14px;
`;

Table.HeadRow = styled.tr`
  opacity: 0.5;
`;

Table.Body = styled.tbody`
  font-size: 12px;
  line-height: 12px;
`;

Table.BodyRow = styled.tr<{
  $active?: boolean
}>`
  background: var(--color-background-black-25);
  pointer-events: all;
  ${(props) => (props.$active ? css`
    background: var(--color-background-success-dark);
  ` : css`
    &:hover {
      background: var(--color-background-black-50);
    }
  `)}
  &:hover {
    cursor: pointer;
  }
`;

Table.Cell = styled.td<{
  $type?: 'delete'
}>`
  padding: 12px 16px;
  overflow: hidden;
  ${(props) => (props.$type === 'delete' && css`
    width: 38px;
    &:hover {
      background: var(--color-background-error-dark);
    }
  `)}
  &:first-child {
    border-radius: 5px 0 0 5px;
  }
  &:last-child {
    border-radius: 0 5px 5px 0;
  }
`;
