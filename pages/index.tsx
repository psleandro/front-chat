import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { EnterRoom } from '../src/components/EnterRoom';
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
    <S.Main>
      {!user && (
        <div>
          <S.SignInWithGoogleButton
            type="button"
            onClick={handleSignInWithGoogle}
          >
            <FaGoogle />
            Crie sua sala com Google
          </S.SignInWithGoogleButton>
          <S.SignInWithMicrosoftButton
            type="button"
            onClick={handleSignInWithMicrosoft}
          >
            <FaMicrosoft />
            Crie sua sala com Microsoft
          </S.SignInWithMicrosoftButton>
        </div>
      )}
      {user && <EnterRoom />}
    </S.Main>
  );
}

export default Home;
