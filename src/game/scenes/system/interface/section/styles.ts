import styled from 'styled-components';

export const Wrapper = styled.div<{
  $direction: 'vertical' | 'horizontal'
  $gap: number
}>`
  display: flex;
  flex-direction: ${(props) => (props.$direction === 'vertical' ? 'column' : 'row')};
  gap: ${(props) => `${props.$gap}px`};
`;
