/* eslint-disable no-useless-escape */
import { Rule } from 'antd/lib/form';

const email: Rule[] = [
  {
    required: true,
    message: 'Informe seu email',
  },
  {
    type: 'email',
    message: 'Digite um email válido',
  },
];

const password: Rule[] = [
  {
    required: true,
    message: 'Informe sua senha',
  },
];

export const rules = {
  email,
  password,
};
