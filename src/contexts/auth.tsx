/* eslint-disable dot-notation */
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  OAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { useRouter } from 'next/router';
import {
  AuthContextData,
  AuthProviderProps,
  IUser,
  SignInCredentials,
} from '../interfaces';
import { api } from '../services/api';
import { clientGraph } from '../graphql/config';
import { REVALIDATE_SIGNIN } from '../graphql';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>();
  const auth = getAuth();

  const router = useRouter();

  const cookies = parseCookies(undefined);
  const previousPath = cookies['@audio-meet/previousPath'];

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('auth/signin', {
        email,
        password,
      });

      const { accessToken, user: userResponse } = response.data;

      const userData = {
        userId: userResponse.id,
        provider: 'mesha',
        name: userResponse.name,
        email: userResponse.email,
        image: '',
        // isAdmin: userResponse.profiles_names.includes('ADMIN'),
      };

      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      setUser(userData);

      setCookie(undefined, '@audio-meet.token', accessToken, {
        maxAge: 60 * 60, // 1h
        path: '/',
      });
    } catch (e) {
      // feedback.error(checkIfErrorIsProvidedFromDtoOrArray(e));
      console.log(e);
    }
  }

  async function signOut() {
    destroyCookie(undefined, '@audio-meet.token', { path: '/' });
    setUser(null);
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();

      const response = await signInWithPopup(auth, provider);

      if (response.user) {
        const { displayName, email, photoURL, uid } = response.user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google');
        }

        setUser({
          userId: uid,
          name: displayName,
          image: photoURL,
          email,
          provider: response.providerId,
        });

        setCookie(
          undefined,
          '@audio-meet/accessToken',
          // eslint-disable-next-line dot-notation
          response.user['accessToken'],
          {
            path: '/',
            maxAge: 60 * 60, // 1h,
          }
        );

        if (previousPath) {
          router.push(
            `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${previousPath}`
          );

          destroyCookie(undefined, '@audio-meet/previousPath', {
            path: '/',
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function signInWithMicrosoft() {
    try {
      const provider = new OAuthProvider('microsoft.com');

      const response = await signInWithPopup(auth, provider);

      if (response.user) {
        const { displayName, uid } = response.user;

        if (!displayName) {
          throw new Error('Missing information from Microsoft');
        }

        setUser({
          userId: uid,
          name: displayName,
          provider: response.providerId,
          // muted: false,
        });

        setCookie(
          undefined,
          '@audio-meet/accessToken',
          response.user['accessToken'],
          {
            path: '/',
            maxAge: 60 * 60, // 1h,
          }
        );

        setCookie(
          undefined,
          '@audio-meet/microsoftOAuthToken',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore-line
          // eslint-disable-next-line no-underscore-dangle
          response._tokenResponse.oauthAccessToken,
          {
            path: '/',
            maxAge: 60 * 60, // 1h,
          }
        );

        if (previousPath) {
          router.push(
            `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${previousPath}`
          );

          destroyCookie(undefined, '@audio-meet/previousPath', {
            path: '/',
          });
        }
      }

      const photo = await axios.get(
        'https://graph.microsoft.com/v1.0/me/photo/$value',
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-line
            // eslint-disable-next-line no-underscore-dangle
            Authorization: `Bearer ${response._tokenResponse.oauthAccessToken}`,
          },
          responseType: 'arraybuffer',
        }
      );

      const avatar = Buffer.from(photo.data, 'binary').toString('base64');

      setUser(value => ({
        ...value,
        image: avatar,
      }));
    } catch (e) {
      // eslint-disable-next-line no-cond-assign, no-constant-condition
      if ((e.response.status = 404)) {
        setUser(value => ({
          ...value,
          image: '',
        }));
      }
      console.log(e);
    }
  }

  async function handleSignOut() {
    if (user.provider === 'mesha') {
      await signOut();
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
      if (userResponse) {
        const { displayName, uid, photoURL } = userResponse;

        if (!displayName) {
          throw new Error('Missing information from Provider');
        }

        const userInfo = {
          userId: uid,
          name: displayName,
          provider: userResponse.providerData[0]['providerId'],
          // muted: false,
        };

        if (userResponse.providerData[0]['providerId'] === 'google.com') {
          Object.assign(userInfo, { image: photoURL });
          setUser(userInfo);

          setCookie(
            undefined,
            '@audio-meet/accessToken',
            userResponse['accessToken'],
            {
              path: '/',
              maxAge: 60 * 60, // 1h,
            }
          );
          return;
        }

        const oAuthCookie = cookies['@audio-meet/microsoftOAuthToken'];

        try {
          const photo = await axios.get(
            'https://graph.microsoft.com/v1.0/me/photo/$value',
            {
              headers: {
                Authorization: `Bearer ${oAuthCookie}`,
              },
              responseType: 'arraybuffer',
            }
          );

          const avatar = Buffer.from(photo.data, 'binary').toString('base64');

          Object.assign(userInfo, { image: avatar });
          setUser(userInfo);

          setCookie(
            undefined,
            '@audio-meet/accessToken',
            userResponse['accessToken'],
            {
              path: '/',
              maxAge: 60 * 60, // 1h,
            }
          );
        } catch (e) {
          // eslint-disable-next-line no-cond-assign, no-constant-condition
          if ((e.response.status = 404)) {
            Object.assign(userInfo, { image: null });
            setUser(userInfo);
          }
          console.log(e);
        }
      } else {
        setUser(undefined);
        destroyCookie(undefined, '@audio-meet/accessToken', {
          path: '/',
        });
        destroyCookie(undefined, '@audio-meet/microsoftOAuthToken', {
          path: '/',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    const { '@audio-meet.token': accessToken } = parseCookies();

    if (accessToken) {
      clientGraph
        .request(REVALIDATE_SIGNIN)
        .then(response => {
          const userData = {
            userId: response.revalidateSignIn.id,
            provider: 'mesha',
            name: response.revalidateSignIn.name,
            email: response.revalidateSignIn.email,
            image: '',
            // isAdmin: userResponse.profiles_names.includes('ADMIN'),
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
        signInWithGoogle,
        signInWithMicrosoft,
        handleSignOut,
        setUser,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
