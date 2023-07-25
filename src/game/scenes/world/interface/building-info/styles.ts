import styled, { css } from 'styled-components';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  position: absolute;
  width: 260px;
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
  padding: 14px 16px;
  background: ${InterfaceColor.BLUE_BLACK}ee;
  border-radius: 10px 10px 0 0;
`;

export const Body = styled.div`
  background: ${InterfaceColor.BLUE_DARK}cc;
  padding: 16px;
  border-radius: 0 0 10px 10px;
`;

export const Name = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: ${InterfaceColor.INFO};
  font-size: 16px;
  line-height: 16px;
`;

export const Level: any = styled.div`
  display: grid;
  grid-template-columns: repeat(${BUILDING_MAX_UPGRADE_LEVEL}, 1fr);
  grid-gap: 5px;
`;

Level.Progress = styled.div<{
  $active?: boolean
}>`
  height: 12px;
  background: #000;
  box-shadow: 0 6px 0 #222 inset;
  ${(props) => (props.$active && css`
    background: ${InterfaceColor.INFO_DARK};
    box-shadow: 0 6px 0 ${InterfaceColor.INFO} inset;
  `)}
`;

export const Health: any = styled.div`
  background: #000;
  position: relative;
  margin-bottom: 6px;
`;

Health.Progress = styled.div`
  height: 14px;
  background: ${InterfaceColor.ERROR_DARK};
  box-shadow: 0 7px 0 rgba(255, 255, 255, 0.15) inset;
`;

Health.Value = styled.div`
  position: absolute;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: #fff;
  font-size: 10px;
  line-height: 10px;
  text-shadow: 1px 1px 0 #000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  padding-bottom: 2px;
`;
