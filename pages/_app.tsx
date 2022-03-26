import '../styles/global';
import 'antd/dist/antd.css';
import ptBR from 'antd/lib/locale/pt_BR';

import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={ptBR}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
