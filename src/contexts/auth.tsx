/* eslint-disable dot-notation */
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  OAuthProvider,
  signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { AuthContextData, AuthProviderProps, IUser } from '../interfaces';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>();
  const auth = getAuth();

  const router = useRouter();

  const cookies = parseCookies(undefined);
  const previousPath = cookies['@audio-meet/previousPath'];

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
          muted: false,
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
          muted: false,
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
    await signOut(auth);
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
          muted: false,
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
            setUser(value => ({
              ...value,
              image: null,
            }));
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

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithMicrosoft,
        handleSignOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
