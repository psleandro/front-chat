import '../styles/global';
import 'antd/dist/antd.css';
import ptBR from 'antd/lib/locale/pt_BR';

import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../src/contexts/auth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={ptBR}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default MyApp;
