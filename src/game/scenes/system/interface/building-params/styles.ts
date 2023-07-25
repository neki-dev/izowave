import styled from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
`;

export const Param = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  overflow: hidden;
`;

export const IconContainer = styled.div`
  width: 34px;
  height: 34px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 5px 5px 0;
`;

export const Icon = styled.img`
  width: 15px;
  height: 15px;
`;

export const Info = styled.div<{
  $attention?: boolean
}>`
  padding: 2px 5px;
  color: ${(props) => (props.$attention
    ? InterfaceColor.WARN
    : '#fff'
  )};
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.PIXEL_TEXT};
  font-size: 10px;
  line-height: 10px;
  opacity: 0.75;
  margin: -1px 0 2px 0;
`;

export const Value = styled.div`
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 12px;
  line-height: 12px;
`;
