import styled, { css } from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Table: any = styled.table`
  margin-bottom: 30px;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 14px;
  line-height: 14px;
  border-collapse: separate; 
  border-spacing: 1px 5px;
`;

Table.Head = styled.thead`
  top: 0;
`;

Table.HeadRow = styled.tr`
  opacity: 0.5;
`;

Table.Body = styled.tbody``;

Table.BodyRow = styled.tr<{
  $active?: boolean
}>`
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  pointer-events: all;
  ${(props) => (props.$active ? css`
    background: ${InterfaceBackgroundColor.SUCCESS_DARK};
  ` : css`
    &:hover {
      background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
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
    &:hover {
      background: ${InterfaceBackgroundColor.ERROR_DARK};
    }
  `)}
  &:first-child {
    border-radius: 5px 0 0 5px;
  }
  &:last-child {
    border-radius: 0 5px 5px 0;
  }
`;
