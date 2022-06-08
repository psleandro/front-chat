/* eslint-disable dot-notation */
import { createContext, useContext, useEffect, useState } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { message } from 'antd';
import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  AuthContextData,
  AuthProviderProps,
  ILoginProviders,
  IUser,
  SignInCredentials,
} from '../interfaces';
import { clientGraph } from '../graphql/config';
import { REVALIDATE_SIGNIN } from '../graphql';
import {
  signInWithMeshuap,
  signInWithGoogle,
  signInWithMicrosoft,
  getMicrosoftImg,
} from '../services/auth';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>();
  const auth = getAuth();

  const router = useRouter();

  const cookies = parseCookies(undefined);
  const previousPath = cookies['@audio-meet/previousPath'];

  async function signIn(
    provider: ILoginProviders,
    credentials?: SignInCredentials
  ) {
    try {
      let getedUser: IUser;
      switch (provider) {
        case 'google.com':
          getedUser = await signInWithGoogle(auth);
          break;
        case 'microsoft.com':
          getedUser = await signInWithMicrosoft(auth);
          break;
        case 'mesha.com':
          getedUser = await signInWithMeshuap(credentials);
          break;
        default:
          throw new Error('Provedor de Login não especificado!');
      }

      setUser(getedUser);

      if (previousPath) {
        router.push(previousPath);
        destroyCookie(undefined, '@audio-meet/previousPath', {
          path: '/',
        });
      }
    } catch (e) {
      message.error(
        e?.message || 'Não foi possível realizar o login. Tente novamente!'
      );
    }
  }

  async function handleSignOut() {
    if (user.provider === 'mesha.com') {
      destroyCookie(undefined, '@audio-meet.token', { path: '/' });
      setUser(null);
      return;
    }
    await firebaseSignOut(auth);
    destroyCookie(undefined, '@audio-meet/accessToken', {
      path: '/',
    });
    destroyCookie(undefined, '@audio-meet/microsoftOAuthToken', {
      path: '/',
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async userResponse => {
      if (!userResponse) {
        setUser(undefined);
        destroyCookie(undefined, '@audio-meet/accessToken', {
          path: '/',
        });
        destroyCookie(undefined, '@audio-meet/microsoftOAuthToken', {
          path: '/',
        });
        return;
      }
      try {
        const {
          displayName,
          uid,
          photoURL,
          providerData: [{ providerId }],
        } = userResponse;

        if (!displayName) {
          throw new Error('Missing information from Provider');
        }

        const oAuthCookie = cookies['@audio-meet/microsoftOAuthToken'];

        const image =
          providerId === 'google.com'
            ? photoURL
            : await getMicrosoftImg(oAuthCookie);

        const userInfo: IUser = {
          provider: providerId as 'google.com' | 'microsoft.com',
          name: displayName,
          userId: uid,
          image,
        };

        setCookie(
          undefined,
          '@audio-meet/accessToken',
          userResponse['accessToken'],
          {
            path: '/',
            maxAge: 60 * 60, // 1h,
          }
        );
        setUser(userInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error on auth', e);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    const { '@audio-meet.token': accessToken } = parseCookies();

    if (accessToken) {
      clientGraph
        .request(REVALIDATE_SIGNIN)
        .then(response => {
          const userData: IUser = {
            userId: response.revalidateSignIn.id,
            provider: 'mesha.com',
            name: response.revalidateSignIn.name,
            email: response.revalidateSignIn.email,
            image: '',
          };

          setUser(userData);
        })
        .catch(() => {
          destroyCookie(undefined, '@audio-meet.token', { path: '/' });
        });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        handleSignOut,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
