import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~lib/interface/const';
import { InterfaceBackgroundColor, InterfaceFont } from '~lib/interface/types';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Head = styled.div`
`;

export const Label = styled.div`
  background: ${InterfaceBackgroundColor.ERROR};
  color: #fff;
  padding: 15px 36px 21px 36px;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  border-radius: 5px 5px 0 0;
  font-size: 46px;
  line-height: 46px;
  text-align: center;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 30px;
    line-height: 30px;
    padding: 12px 30px 16px 30px;
  }
`;

export const Button = styled.div`
  margin-top: 20px;
  pointer-events: all;
  color: #fff;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  border-radius: 5px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${InterfaceBackgroundColor.SUCCESS_GRADIENT};  
  font-size: 22px;
  line-height: 22px;
  padding: 25px;
  &:hover {
    cursor: pointer;
    background: ${InterfaceBackgroundColor.SUCCESS};
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-top: 15px;
    padding: 18px 20px 20px 20px;
    font-size: 20px;
    line-height: 20px;
  }
`;

export const IconRestart = styled.img`
  width: 24px;
  margin-right: 10px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    width: 20px;
  }
`;
