import { ReactNode } from 'react';

export interface createUserDto {
  userId: string;
  username: string;
  color: string;
}

export interface IPeerData {
  peerId: string;
}

export interface IUser {
  userId: string;
  socketId: string;
  username: string;
  color: string;
}

export interface IUserDto extends IUser, IPeerData {}

export interface AuthContextData {
  user: IUser;
  signIn: (userData: createUserDto) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
