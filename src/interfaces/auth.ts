import { ReactNode } from 'react';

export type ILoginProviders = 'google.com' | 'microsoft.com' | 'mesha.com';

export interface createUserDto {
  userId: string;
  username: string;
  color: string;
}

export interface IPeerData {
  peerId: string;
  username?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface IUser {
  userId: string;
  socketId?: string;
  name?: string;
  email?: string;
  image?: string;
  provider: ILoginProviders;
}

export interface IUserDto extends IUser, IPeerData {}

export interface AuthContextData {
  user: IUser;
  handleSignOut: () => Promise<void>;
  signIn: (
    provider: ILoginProviders,
    credentials?: SignInCredentials
  ) => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
