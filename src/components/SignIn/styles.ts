import styled from 'styled-components';
import { Input as AntdInput, Button as AntdButton } from 'antd';

export const Container = styled.div`
  width: 420px;
  background: #ffffff;

  display: flex;
  flex-direction: column;

  padding: 24px 16px 24px 16px;
  border-radius: 8px;

  .ant-input-affix-wrapper {
    svg {
      color: #556ee6;
    }
  }

  h1 {
    color: #556ee6;
    font-size: 32px;
    text-align: center;
    margin-bottom: 24px;
  }

  label {
    color: #495057;
  }
`;

export const Input = styled(AntdInput)`
  color: #495057;

  border-radius: 8px;
  border-color: #ced4da;
`;

export const Button = styled(AntdButton)`
  color: #fff;
  width: 100%;

  background: #556ee6;
  border-radius: 8px;
`;

export const ForgotPassword = styled.div`
  color: #74788d;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #74788d;
    margin-right: 8px;
  }
`;

export const CreateAccount = styled.div`
  margin-top: 16px;

  p {
    color: #74788d;

    a {
      color: #556ee6;
    }
  }
`;

interface PrivacyContainerProps {
  visible: boolean;
}

export const PrivacyContainer = styled.div<PrivacyContainerProps>`
  display: ${props => (props.visible ? 'flex' : 'none')};
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  position: fixed;
  bottom: 0;
  padding: 16px 32px;

  min-width: 50%;
  max-width: 80%;

  background-color: #556ee6;

  p {
    margin: 0;
    color: #000;
  }

  a {
    color: #fff;
    text-decoration: underline;
  }
`;
