import '../styles/global';
import 'antd/dist/antd.css';
import ptBR from 'antd/lib/locale/pt_BR';

import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../src/contexts/auth';
import { RoomProvider } from '../src/contexts';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={ptBR}>
      <SessionProvider session={pageProps.session}>
        <AuthProvider>
          <RoomProvider>
            <Component {...pageProps} />
          </RoomProvider>
        </AuthProvider>
      </SessionProvider>
    </ConfigProvider>
  );
}

export default MyApp;
