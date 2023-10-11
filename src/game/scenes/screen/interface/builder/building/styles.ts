import styled from 'styled-components';

import { INTERFACE_DESKTOP_BREAKPOINT } from '~const/interface';
import { InterfaceBackgroundColor, InterfaceFont, InterfaceTextColor } from '~type/interface';

export const Info = styled.div`
  position: absolute;
  z-index: 2;
  transform: translateX(-100%);
  display: none;
  pointer-events: none;
  width: 164px;
  height: 100%;
  padding: 12px 14px;
  background: ${InterfaceBackgroundColor.BLUE_DARK};
  border-radius: 5px 0 0 5px;
`;

export const Name = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  color: ${InterfaceTextColor.SUCCESS};
  font-size: 14px;
  line-height: 14px;
  margin-bottom: 8px;
  white-space: nowrap;
`;

export const Text = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 9px;
  line-height: 11px;
  letter-spacing: 1px;
  color: #fff;
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  pointer-events: all;
  @media ${INTERFACE_DESKTOP_BREAKPOINT} {
    &:hover {
      ${Info} {
        display: block;
        + [role=hint] {
          display: none;
        }
      }
    }
  }
`;
