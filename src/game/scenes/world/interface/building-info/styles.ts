import styled from 'styled-components';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  position: absolute;
  width: 280px;
  background: ${InterfaceColor.BLUE_DARK}cc;
  padding: 20px;
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

export const Name = styled.div`
  font-family: ${InterfaceFont.PIXEL};
  color: ${InterfaceColor.INFO};
  font-size: 19px;
  line-height: 19px;
  text-shadow: 2px 2px 0 #000;
  padding-bottom: 2px;
`;

export const UpgradeLevel: any = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(${BUILDING_MAX_UPGRADE_LEVEL}, 1fr);
  grid-gap: 3px;
`;

UpgradeLevel.Item = styled.div`
  height: 10px;
  background: #000;
  box-shadow: 0 5px 0 #222 inset;
  &.active {
    background: ${InterfaceColor.INFO_DARK};
    box-shadow: 0 5px 0 ${InterfaceColor.INFO} inset;
  }
`;
