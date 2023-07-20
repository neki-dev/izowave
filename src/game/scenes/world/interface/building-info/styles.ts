import styled, { css } from 'styled-components';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  position: absolute;
  width: 280px;
  transform: translate(-50%, -100%);
  margin-top: -32px;
  &::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 15px solid ${InterfaceColor.BLUE_DARK}cc;
  }
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${InterfaceColor.BLUE_BLACK}ee;
`;

export const Body = styled.div`
  background: ${InterfaceColor.BLUE_DARK}cc;
  padding: 20px;
`;

export const Name = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  color: ${InterfaceColor.INFO};
  font-size: 16px;
  line-height: 16px;
`;

export const UpgradeLevel = styled.div`
  display: grid;
  grid-template-columns: repeat(${BUILDING_MAX_UPGRADE_LEVEL}, 1fr);
  grid-gap: 3px;
`;

export const Progress = styled.div<{
  $active?: boolean
}>`
  height: 10px;
  background: #000;
  box-shadow: 0 5px 0 #222 inset;
  ${(props) => (props.$active && css`
    background: ${InterfaceColor.INFO_DARK};
    box-shadow: 0 5px 0 ${InterfaceColor.INFO} inset;
  `)}
`;
