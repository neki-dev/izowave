import styled from 'styled-components';

import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { ScreenTexture } from '~type/screen';

export const Wrapper = styled.div`
  width: 280px;
  background: ${INTERFACE_TEXT_COLOR.BLUE_DARK};
  padding: 20px;
  &::after {
    position: absolute;
    content: '';
    right: 0;
    top: 30px;
    transform: translate(100%, -50%);
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 15px solid ${INTERFACE_TEXT_COLOR.BLUE_DARK};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Name = styled.div`
  font-family: ${INTERFACE_FONT.PIXEL};
  color: ${INTERFACE_TEXT_COLOR.PRIMARY};
  font-size: 18px;
  line-height: 18px;
  text-shadow: 3px 3px 0 #332717;
`;

export const Limit = styled.div`
  color: #fff;
  font-family: ${INTERFACE_FONT.MONOSPACE};
  font-size: 13px;
  line-height: 13px;
  &.attention {
    color: ${INTERFACE_TEXT_COLOR.WARN};
  }
`;

export const Description = styled.div`
  margin-top: 10px;
  color: #fff;
  font-family: ${INTERFACE_FONT.MONOSPACE};
  font-size: 14px;
  line-height: 16px;
  text-shadow: 2px 2px 0 #000;
`;

export const Parameters = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
`;

export const Parameter: any = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  padding: 5px;
`;

Parameter.IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

Parameter.Icon = styled.div`
  width: 10px;
  height: 10px;
  background: url(assets/sprites/${ScreenTexture.ICON}.png);
`;

Parameter.Info = styled.div`
  color: #fff;
  &.attention {
    color: ${INTERFACE_TEXT_COLOR.WARN};
  }
`;

Parameter.Label = styled.div`
  font-family: ${INTERFACE_FONT.MONOSPACE};
  font-size: 11px;
  line-height: 11px;
  opacity: 0.75;
  margin-top: -2px;
`;

Parameter.Value = styled.div`
  font-family: ${INTERFACE_FONT.PIXEL};
  font-size: 14px;
  line-height: 14px;
`;

export const Cost: any = styled.div`
  margin-top: 10px;
  font-family: ${INTERFACE_FONT.MONOSPACE};
  color: #fff;
  font-size: 13px;
  line-height: 13px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.25);
`;

Cost.Icon = styled.img`
  width: 16px;
  margin-left: 10px;
`;

Cost.Value = styled.div`
  margin: -1px 0 0 5px;
  font-family: ${INTERFACE_FONT.PIXEL};
  font-size: 14px;
  line-height: 14px;
  &.attention {
    color: ${INTERFACE_TEXT_COLOR.ERROR};
  }
`;
