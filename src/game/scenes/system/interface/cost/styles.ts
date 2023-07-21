import styled, { css } from 'styled-components';

import { InterfaceFont, InterfaceColor } from '~type/interface';

export const Wrapper = styled.div<{
  $size: 'small' | 'large'
}>`
  color: #fff;
  display: flex;
  align-items: center;
  ${(props) => (props.$size === 'small') && css`
    zoom: 0.75;
  `}
`;

export const Label = styled.div`
  font-family: ${InterfaceFont.MONOSPACE};
  font-size: 13px;
  line-height: 13px;
  margin: -1px 10px 0 0;
`;

export const Icon = styled.img`
  width: 16px;
  margin-right: 5px;
`;

export const Value = styled.div<{
  $attention?: boolean
}>`
  margin-top: -2px;
  font-family: ${InterfaceFont.PIXEL};
  font-size: 15px;
  line-height: 15px;
  color: ${(props) => (props.$attention
    ? InterfaceColor.ERROR
    : '#fff'
  )};
`;
