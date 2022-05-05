import styled from 'styled-components';

export const Main = styled.main`
  height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SignInButton = styled.button`
  cursor: pointer;
  background: #6614d2;
  border: 1px solid #6614d2;
  color: #fff;
  border-radius: 8px;
  display: inline-block;

  font-size: 1rem;
  height: 56px;
  width: 344px;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    h4 {
      color: #fff;
      margin: 0;
    }
  }
`;
