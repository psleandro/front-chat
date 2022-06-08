import { ReactNode } from 'react';

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
  provider: string;
}

export interface IUserDto extends IUser, IPeerData {}

export interface AuthContextData {
  user: IUser;
  userImage: string;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
