import { useState } from 'react';
import { Form } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import * as S from './styles';
import { rules } from './rules';
import { useAuth } from '../../contexts';

interface FormFields {
  email: string;
  password: string;
}

export default function SignIn() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSignIn = async (fields: FormFields) => {
    setLoading(true);

    await signIn('mesha.com', fields);
    setLoading(false);
  };

  return (
    <>
      <S.Container>
        <h1>Sign In</h1>
        <Form
          form={form}
          onFinish={handleSignIn}
          layout="vertical"
          hideRequiredMark
        >
          <Form.Item name="email" label="E-mail" rules={rules.email}>
            <S.Input type="email" prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={rules.password}>
            <S.Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <S.Button htmlType="submit" loading={loading}>
              Entrar
            </S.Button>
          </Form.Item>
        </Form>
      </S.Container>
      {/* <S.CreateAccount>
        <p>
          Ainda não possui uma conta? <Link href="/sign-up">Registre-se</Link>
        </p>
      </S.CreateAccount> */}
    </>
  );
}
