import styled from 'styled-components';

export const Center = styled.div`
  background-color: #8e44ee;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 16px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex: 1;
  gap: 4px;
`;

export const Form = styled.form`
  display: 'flex';
  flex-direction: 'column';
  gap: 32px;
`;

export const Label = styled.label``;

export const Input = styled.input`
  width: 304px;
  height: 40px;
  color: #333;
  border: 1px solid #dcdce6;
  border-radius: 8px;
  padding: 0px 12px;
  font-size: 16px;
`;
interface ButtonProps {
  locked: boolean;
}

export const Button = styled.button<ButtonProps>`
  width: 144px;
  height: 40px;
  background: #6614d2;
  border: 0;
  border-radius: 8px;
  color: #fff;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  line-height: 40px;
  transition: filter 0.2s;

  &:hover {
    opacity: 0.9;
    cursor: ${props => (props.locked ? 'not-allowed' : 'pointer')};
  }
`;

export const Avatar = styled.div`
  img {
    border-radius: 16rem;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;

  gap: 12px;

  h3 {
    margin: 0;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  gap: 12px;
`;

export const Logout = styled.div`
  height: 14px;

  color: #ff5252;

  &:hover {
    cursor: pointer;
  }
`;
