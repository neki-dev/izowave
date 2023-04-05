import styled from 'styled-components';

import { INTERFACE_FONT } from '~const/interface';

export const Actions = styled.div`
  margin-top: 100px;
  position: absolute;
  left: 50%;
`;

export const Action: any = styled.div`
  padding: 3px 7px 4px 7px;
  background: rgba(0, 0, 0, 0.75);
  transform: translateX(-50%);
  pointer-events: all;
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 3px;
  }
  &:hover {
    cursor: pointer;
    background: #000;
  }
`;

Action.Label = styled.div`
  color: #fff;
  font-family: ${INTERFACE_FONT.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
`;

Action.Addon = styled.div`
  margin: 1px 0 0 6px;
`;
