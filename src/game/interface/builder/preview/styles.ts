import styled from 'styled-components';

import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';

export const Building: any = styled.div`
  width: 60px;
  height: 60px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  position: relative;
  &:not(.disabled):hover {
    background: #000;
    cursor: pointer;
  }
  &.disallow {
    opacity: 0.5;
    filter: grayscale(100%);
  }
  &.disabled {
    opacity: 0.25;
  }
  &.active {
    opacity: 1.0;
    background: ${INTERFACE_TEXT_COLOR.BLUE_DARK};
  }
`;

Building.Preview = styled.div`
  overflow: hidden;
  width: 34px;
  height: 40px;
  img {
    height: 100%;
  }
`;

Building.Number = styled.div`
  position: absolute;
  color: #fff;
  font-family: ${INTERFACE_FONT.MONOSPACE};
  font-size: 12px;
  line-height: 12px;
  right: 4px;
  top: 4px;
  opacity: 0.75;
`;
