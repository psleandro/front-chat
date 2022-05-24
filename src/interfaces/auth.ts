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

export interface IUser {
  userId: string;
  socketId?: string;
  name?: string;
  email?: string;
  image?: string;
  provider: string;
  muted: boolean;
}

export interface IUserDto extends IUser, IPeerData {}

export interface AuthContextData {
  user: IUser;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
