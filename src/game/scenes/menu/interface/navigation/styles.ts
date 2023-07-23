import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.ul`
  margin-top: 70px;
  list-style: none;
  text-align: right;
  pointer-events: all;
`;

export const Item = styled.li<{
  $active?: boolean
}>`
  color: ${(props) => (props.$active
    ? InterfaceColor.INFO
    : '#fff'
  )};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 22px;
  line-height: 22px;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  &:hover {
    cursor: pointer;
    color: ${InterfaceColor.PRIMARY};
  }
`;
