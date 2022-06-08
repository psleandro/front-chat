import { Divider } from 'antd';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { EnterRoom } from '../src/components/EnterRoom';
import SignIn from '../src/components/SignIn';
import { useAuth } from '../src/contexts';
import * as S from '../styles/home';

function Home() {
  const { user, signInWithMicrosoft, signInWithGoogle } = useAuth();

  const handleSignInWithGoogle = async () => {
    if (!user) {
      await signInWithGoogle();
    }
  };

  const handleSignInWithMicrosoft = async () => {
    if (!user) {
      await signInWithMicrosoft();
    }
  };

  return (
    <S.Container>
      {!user && (
        <>
          <SignIn />
          <Divider type="vertical" />
        </>
      )}
      <S.Main>
        {!user && (
          <div>
            <S.SignInWithGoogleButton
              type="button"
              onClick={handleSignInWithGoogle}
            >
              <FaGoogle />
              Entrar com o Google
            </S.SignInWithGoogleButton>
            <S.SignInWithMicrosoftButton
              type="button"
              onClick={handleSignInWithMicrosoft}
            >
              <FaMicrosoft />
              Entrar com Microsoft
            </S.SignInWithMicrosoftButton>
          </div>
        )}
        {user && <EnterRoom />}
      </S.Main>
    </S.Container>
  );
}

export default Home;
