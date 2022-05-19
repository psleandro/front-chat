import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  OAuthProvider,
  signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as newUuid } from 'uuid';
import axios from 'axios';
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
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function signInWithMicrosoft() {
    try {
      const provider = new OAuthProvider('microsoft.com');

      const response = await signInWithPopup(auth, provider);

      // const photo = await axios.get(
      //   'https://graph.microsoft.com/v1.0/me/photos/48x48/$value',
      //   {
      //     headers: {
      //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //       // @ts-ignore-line
      //       // eslint-disable-next-line no-underscore-dangle
      //       Authorization: `Bearer ${response._tokenResponse.oauthAccessToken}`,
      //     },
      //   }
      // );

      if (response.user) {
        const { displayName, uid, photoURL } = response.user;

        if (!displayName) {
          throw new Error('Missing information from Microsoft');
        }

        setUser({
          userId: uid,
          name: displayName,
          image: photoURL,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, userResponse => {
      if (userResponse) {
        const { displayName, uid, photoURL } = userResponse;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google');
        }

        setUser({
          userId: uid,
          name: displayName,
          image: photoURL,
        });
      } else {
        setUser(undefined);
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
