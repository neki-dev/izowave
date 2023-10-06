import styled, { css } from 'styled-components';

import { InterfaceFont, InterfaceTextColor } from '~type/interface';

export const Wrapper = styled.div<{
  $size: 'small' | 'medium' | 'large'
}>`
  color: #fff;
  display: flex;
  align-items: center;
  ${(props) => {
    switch (props.$size) {
      case 'small': return css`
        zoom: 0.75;
      `;
      case 'medium': return css`
        zoom: 0.9;
      `;
    }
  }}
`;

export const Icon = styled.img`
  width: 16px;
  margin-right: 5px;
`;

export const Value = styled.div<{
  $attention?: boolean
}>`
  margin-top: -2px;
  font-family: ${InterfaceFont.PIXEL_LABEL};
  font-size: 15px;
  line-height: 15px;
  color: ${(props) => (props.$attention
    ? InterfaceTextColor.ERROR
    : '#fff'
  )};
`;
