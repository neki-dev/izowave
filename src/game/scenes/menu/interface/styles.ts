import styled from 'styled-components';

import { InterfaceBackgroundColor } from '~type/interface';

export const Wrapper = styled.div`
  height: 90vh;
  max-height: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Block = styled.div`
  width: 90%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 60px;

  ${Block} {
    align-items: center;
  }
`;

export const Menu = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: ${InterfaceBackgroundColor.BLACK_TRANSPARENT_50};
  padding: 40px 0 36px 0;
  margin-bottom: 60px;
`;

export const Main = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

export const Logotype = styled.img`
  height: 70px;
`;
