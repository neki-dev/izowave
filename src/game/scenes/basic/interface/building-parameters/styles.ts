import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Parameters = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
`;

export const Parameter = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
`;

export const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  background: rgba(0, 0, 0, 0.5);
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.div`
  width: 15px;
  height: 15px;
  background: url(assets/sprites/interface/building/icons.png);
`;

export const Info = styled.div`
  color: #fff;
  &.attention {
    color: ${InterfaceColor.WARN};
  }
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 10px;
  line-height: 10px;
  opacity: 0.75;
  margin: -1px 0 2px 0;
`;

export const Value = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  font-size: 12px;
  line-height: 12px;
`;
