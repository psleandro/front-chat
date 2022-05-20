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
import { AuthContextData, AuthProviderProps, IUser } from '../interfaces';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>();
  const auth = getAuth();

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

        setUser({
          userId: uid,
          name: displayName,
          provider: userResponse.providerData[0]['providerId'],
        });

        if (userResponse.providerData[0]['providerId'] === 'google.com') {
          setUser(value => ({
            ...value,
            image: photoURL,
          }));

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

        const cookies = parseCookies(undefined);
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

          setUser(value => ({
            ...value,
            image: avatar,
          }));

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
              image: '',
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
