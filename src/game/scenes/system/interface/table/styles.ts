import styled, { css } from 'styled-components';

import { InterfaceBackgroundColor, InterfaceFont } from '~type/interface';

export const Table: any = styled.table`
  margin-bottom: 30px;
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
  color: #ccc;
`;

Table.Body = styled.tbody``;

Table.BodyRow = styled.tr<{
  $active?: boolean
}>`
  border-radius: 5px; 
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_25};
  color: #fff;
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
  ${(props) => (props.$type === 'delete' && css`
    &:hover {
      background: ${InterfaceBackgroundColor.ERROR_DARK};
    }
  `)}
`;
