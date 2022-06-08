import axios from 'axios';
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { setCookie } from 'nookies';
import type { Auth } from 'firebase/auth';
import { IUser, SignInCredentials } from '../interfaces';
import { api } from './api';

export const getMicrosoftImg = async (token: string): Promise<string> => {
  const photo = await axios.get(
    'https://graph.microsoft.com/v1.0/me/photo/$value',
    {
      headers: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-line
        // eslint-disable-next-line no-underscore-dangle
        Authorization: `Bearer ${token}`,
      },
      responseType: 'arraybuffer',
    }
  );

  const avatar = Buffer.from(photo.data, 'binary').toString('base64');
  return avatar;
};

export const signInWithMeshuap = async ({
  email,
  password,
}: SignInCredentials): Promise<IUser> => {
  const response = await api.post('auth/signin', {
    email,
    password,
  });

  const { accessToken, user: userResponse } = response.data;

  const userData: IUser = {
    userId: userResponse.id,
    provider: 'mesha.com',
    name: userResponse.name,
    email: userResponse.email,
    image: '',
    // isAdmin: userResponse.profiles_names.includes('ADMIN'),
  };

  api.defaults.headers.Authorization = `Bearer ${accessToken}`;

  setCookie(undefined, '@audio-meet.token', accessToken, {
    maxAge: 60 * 60, // 1h
    path: '/',
  });

  return userData;
};

export const signInWithGoogle = async (auth: Auth): Promise<IUser> => {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  if (!response.user)
    throw new Error('Erro ao tentar obter as informações do usuário!');

  const { displayName, email, photoURL, uid } = response.user;

  if (!displayName || !photoURL) {
    throw new Error('Missing information from Google');
  }

  const user: IUser = {
    userId: uid,
    name: displayName,
    image: photoURL,
    email,
    provider: response.providerId as 'google.com',
  };

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

  return user;
};

export const signInWithMicrosoft = async (auth: Auth): Promise<IUser> => {
  const provider = new OAuthProvider('microsoft.com');
  const response = await signInWithPopup(auth, provider);
  if (!response.user)
    throw new Error('Erro ao tentar obter as informações do usuário!');

  const { displayName, uid } = response.user;

  if (!displayName) {
    throw new Error('Missing information from Microsoft');
  }

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-line
  // eslint-disable-next-line no-underscore-dangle
  const image = await getMicrosoftImg(response._tokenResponse.oauthAccessToken);

  const user: IUser = {
    userId: uid,
    name: displayName,
    provider: response.providerId as 'microsoft.com',
    image,
  };

  return user;
};
