import styled from 'styled-components';

import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';

export const Select: any = styled.ul`
  list-style: none;
  pointer-events: all;
  &.disabled {
    pointer-events: none;
    opacity: 0.75;
  }
`;

Select.Item = styled.li`
  color: #fff;
  font-family: ${INTERFACE_FONT.PIXEL};
  font-size: 18px;
  line-height: 18px;
  text-shadow: 4px 4px 0 #000;
  &:not(:last-child) {
    margin-bottom: 15px;
  }
  &:hover {
    cursor: pointer;
    color: ${INTERFACE_TEXT_COLOR.ACTIVE};
  }
  &.active {
    color: ${INTERFACE_TEXT_COLOR.ACTIVE};
  }
`;
