import styled, { css } from 'styled-components';

export const Wrapper = styled.div<{
  $direction: 'vertical' | 'horizontal'
  $gap: number
}>`
  display: flex;
  flex-direction: ${(props) => (props.$direction === 'vertical' ? 'column' : 'row')};
  > *:not(:last-child) {
    ${(props) => (props.$direction === 'vertical'
    ? css`margin-bottom: ${props.$gap}px`
    : css`margin-right: ${props.$gap}px`
  )};
  }
`;
