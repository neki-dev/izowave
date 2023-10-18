import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~const/interface';
import { InterfaceFont, InterfaceTextColor } from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-top: 40px;
  }
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
`;

export const Value = styled.div`
  font-size: 20px;
  line-height: 20px;
  padding: 4px 8px 7px 8px;
  border-radius: 3px;
  border: 1px solid #fff;
`;

export const Label = styled.div`
  margin-left: 10px;
  font-size: 16px;
  line-height: 16px;
  white-space: pre;
`;

export const Record = styled.div`
  margin-left: 15px;
  font-size: 12px;
  line-height: 12px;
  color: ${InterfaceTextColor.SUCCESS};
`;
