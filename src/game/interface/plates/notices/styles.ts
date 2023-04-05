import styled from 'styled-components';

import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { NoticeType } from '~type/screen';

export const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Item = styled.div`
  padding: 10px 15px;
  color: #fff;
  font-family: ${INTERFACE_FONT.PIXEL};
  font-size: 16px;
  line-height: 16px;
  text-shadow: 2px 2px 0 #000;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  &.${NoticeType.INFO} {
    background: ${INTERFACE_TEXT_COLOR.INFO_DARK};
  }
  &.${NoticeType.WARN} {
    background: ${INTERFACE_TEXT_COLOR.WARN_DARK};
  }
  &.${NoticeType.ERROR} {
    background: ${INTERFACE_TEXT_COLOR.ERROR_DARK};
  }
`;
