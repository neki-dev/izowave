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
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  white-space: pre-line;
`;

export const Link = styled.a`
  color: rgba(255, 255, 255, 0.75);
  pointer-events: all;
  &:hover {
    color: ${InterfaceColor.INFO};
  }
`;

export const Discord = styled.a`
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.75);
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-decoration: none;
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.75);
  padding: 5px 9px;
  border-radius: 3px;
  &:hover {
    border-color: transparent;
    background: #111;
  }
`;

export const Icon = styled.img`
  width: 16px;
  margin-right: 8px;
  display: inline-block;
`;
