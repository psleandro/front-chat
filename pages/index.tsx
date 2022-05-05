import { signIn, useSession } from 'next-auth/react';
import { EnterRoom } from '../src/components/EnterRoom';
import * as S from '../styles/home';

function Home() {
  const { data: session } = useSession();
  return (
    <S.Main>
      {!session && (
        <S.SignInButton type="button" onClick={() => signIn('auth0')}>
          <div>
            <h4>Escolha uma conta para continuar</h4>
          </div>
        </S.SignInButton>
      )}
      {session && <EnterRoom />}
    </S.Main>
  );
}

export default Home;
