import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const Description = styled.div`
  margin-bottom: 5px;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 12px;
  line-height: 12px;
`;

export const Values = styled.ul<{
  $disabled?: boolean
}>`
  list-style: none;
  display: flex;
  pointer-events: all;
  ${(props) => (props.$disabled && `
    pointer-events: none;
    opacity: 0.5;
  `)}
`;

export const Value = styled.li<{
  $active?: boolean
}>`
  color: ${(props) => (props.$active
    ? InterfaceColor.INFO
    : 'rgba(255, 255, 255, 0.75)'
  )};
  font-family: ${InterfaceFont.PIXEL};
  font-size: 13px;
  line-height: 13px;
  border: 1px solid ${(props) => (props.$active
    ? InterfaceColor.INFO
    : 'rgba(255, 255, 255, 0.75)'
  )};
  padding: 2px 5px 4px 5px;
  &:not(:last-child) {
    margin-right: 5px;
  }
  &:hover {
    cursor: pointer;
    color: ${InterfaceColor.PRIMARY};
    border-color: ${InterfaceColor.PRIMARY};
  }
`;
