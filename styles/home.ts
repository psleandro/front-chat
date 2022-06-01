import styled from 'styled-components';

export const Container = styled.main`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  background: #f2f5ff;

  > div:nth-child(2) {
    height: 420px;
  }
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 16px 24px 16px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
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

export const SignInWithGoogleButton = styled.button`
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 500;
  background: #ea4335;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  cursor: pointer;

  border: 0;

  transition: filter 0.3s;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const SignInWithMicrosoftButton = styled.button`
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 500;
  background: #fff;
  color: #00a1f1;
  border: 1px solid #00a1f1;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  cursor: pointer;

  transition: all 0.3s;

  &:hover {
    color: #fff;
    border: 1px solid #fff;
    background: #00a1f1;
  }
`;
