// import Peer from 'peerjs';
import { Socket } from 'socket.io-client';
import { IUser, IUserDto } from './auth';

export type PeerState = Record<
  string,
  { stream?: MediaStream; userName?: string; id?: string }
>;

interface ServerToClientEvents {
  ['get-all-users-connected']: (users: IUser[]) => void;
  ['res-room-invite-verification']: (isValid: boolean) => void;
}

interface ClientToServerEvents {
  ['join-room']: (roomId: string | string[], user: IUserDto) => void;
  ['req-room-invite-verification']: (roomId: string | string[]) => void;
  ['disconnect']: () => void;
}

export interface RoomContextData {
  myPeer: any;
  stream: MediaStream;
  peers: any;
  ws: Socket<ServerToClientEvents, ClientToServerEvents>;
  toggleMicrophone: () => void;
  isSharing: boolean;
  switchStreamToScreen: () => void;
  allUsers: IUser[];
}
