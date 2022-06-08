import { Divider } from 'antd';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { EnterRoom } from '../src/components/EnterRoom';
import SignIn from '../src/components/SignIn';
import { useAuth } from '../src/contexts';
import * as S from '../styles/home';

function Home() {
  const { user, signIn } = useAuth();

  const handleSignInWithGoogle = async () => {
    if (!user) {
      await signIn('google.com');
    }
  };

  const handleSignInWithMicrosoft = async () => {
    if (!user) {
      await signIn('microsoft.com');
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
              Entre com sua conta Google
            </S.SignInWithGoogleButton>
            <S.SignInWithMicrosoftButton
              type="button"
              onClick={handleSignInWithMicrosoft}
            >
              <FaMicrosoft />
              Entre com sua conta Microsoft
            </S.SignInWithMicrosoftButton>
          </div>
        )}
        {user && <EnterRoom />}
      </S.Main>
    </S.Container>
  );
}

export default Home;
