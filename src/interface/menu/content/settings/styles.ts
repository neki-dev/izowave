import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div``;

export const Setting: any = styled.div`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

Setting.Description = styled.div`
  margin-bottom: 5px;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 12px;
  line-height: 12px;
  text-shadow: 2px 2px 0 #000;
`;

export const Values: any = styled.ul`
  list-style: none;
  display: flex;
  pointer-events: all;
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

Values.Item = styled.li`
  color: rgba(255, 255, 255, 0.75);
  font-family: ${InterfaceFont.PIXEL};
  font-size: 13px;
  line-height: 13px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  padding: 2px 5px 4px 5px;
  &:not(:last-child) {
    margin-right: 5px;
  }
  &:hover {
    cursor: pointer;
    color: ${InterfaceColor.PRIMARY};
    border-color: ${InterfaceColor.PRIMARY};
  }
  &.active {
    color: ${InterfaceColor.ACTIVE};
    border-color: ${InterfaceColor.ACTIVE};
  }
`;
