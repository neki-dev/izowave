import styled from 'styled-components';

import { INTERFACE_MOBILE_BREAKPOINT } from '~core/interface/const';

export const Wrapper = styled.div`
  margin-top: 50px;
  font-family: var(--font-pixel-text);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-top: 30px;
    flex-direction: row;
  }
`;

export const About = styled.div`
  color: rgba(255, 255, 255, 0.75);
  text-align: right;
  white-space: pre-line;
  font-size: 12px;
  line-height: 12px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    font-size: 8px;
    line-height: 8px;
  }
`;

export const Author = styled.div`
  margin-bottom: 8px;
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    margin-bottom: 5px;
  }
`;

export const Link = styled.a`
  color: #fff;
  pointer-events: all;
  &:hover {
    color: var(--color-text-hover);
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
  font-size: 13px;
  line-height: 13px;
  padding: 5px 9px;
  border-radius: 3px;
  background: #6170C1;
  &:hover {
    background: #111;
  }
  @media ${INTERFACE_MOBILE_BREAKPOINT} {
    padding: 3px 6px;
    margin: 0 0 0 10px;
  }
`;

export const Icon = styled.img`
  width: 16px;
  margin-right: 8px;
  display: inline-block;
`;
