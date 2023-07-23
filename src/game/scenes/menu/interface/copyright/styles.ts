import styled from 'styled-components';

import { InterfaceColor, InterfaceFont } from '~type/interface';

export const Wrapper = styled.div`
  margin-top: 60px;
  font-family: ${InterfaceFont.MONOSPACE};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const About = styled.div`
  color: rgba(255, 255, 255, 0.75);
  text-align: right;
  white-space: pre-line;
`;

export const Link = styled.a`
  color: #fff;
  pointer-events: all;
  &:hover {
    color: ${InterfaceColor.INFO};
  }
`;

export const Discord = styled.a`
  margin-top: 10px;
  color: #fff;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-decoration: none;
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
  padding: 5px 9px;
  border-radius: 3px;
  background: #111;
  &:hover {
    background: #6170C1;
  }
`;

export const Icon = styled.img`
  width: 16px;
  margin-right: 8px;
  display: inline-block;
`;
