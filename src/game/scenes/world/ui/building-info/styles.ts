import styled from 'styled-components';

import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';

export const Wrapper = styled.div`
  position: absolute;
  width: 280px;
  background: ${INTERFACE_TEXT_COLOR.BLUE_DARK}cc;
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
    border-top: 15px solid ${INTERFACE_TEXT_COLOR.BLUE_DARK}cc;
  }
`;

export const Name = styled.div`
  font-family: ${INTERFACE_FONT.PIXEL};
  color: ${INTERFACE_TEXT_COLOR.PRIMARY};
  font-size: 19px;
  line-height: 19px;
  text-shadow: 3px 3px 0 #332717;
`;

export const UpgradeLevel: any = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(${BUILDING_MAX_UPGRADE_LEVEL}, 1fr);
  grid-gap: 2px;
`;

UpgradeLevel.Item = styled.div`
  height: 10px;
  border: 1px solid #000;
  background: #000;
  &.active {
    background: ${INTERFACE_TEXT_COLOR.INFO_DARK};
  }
`;
