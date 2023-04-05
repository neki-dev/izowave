import styled from 'styled-components';

import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';

export const Wrapper = styled.div`
  width: 280px;
  background: ${INTERFACE_TEXT_COLOR.BLUE_DARK}cc;
  padding: 20px;
  &::after {
    position: absolute;
    content: '';
    right: 0;
    top: 30px;
    transform: translate(100%, -50%);
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 15px solid ${INTERFACE_TEXT_COLOR.BLUE_DARK}cc;
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

export const Cost: any = styled.div`
  margin-top: 10px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.25);
`;
