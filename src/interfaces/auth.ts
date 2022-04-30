import { ReactNode } from 'react';

export interface IUser {
  userId: string;
  socketId: string;
  username: string;
  color: string;
}

export interface AuthContextData {
  user: IUser;
  signIn: (userData: IUser) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
