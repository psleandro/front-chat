/* eslint-disable global-require */
import * as PeerObj from 'peerjs';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { RoomContextData, IUser, IUserDto, PeerState } from '../interfaces';

const peersReducer = (state: PeerState, action) => {
  if (action.type === 'ADD_PEER_STREAM') {
    return {
      ...state,
      [action.payload.peerId]: {
        ...state[action.payload.peerId],
        username: action.payload.username,
        id: action.payload.peerId,
        stream: action.payload.stream,
      },
    };
  }

  if (action.type === 'REMOVE_PEER_STREAM') {
    const newState = state;

    delete newState[action.payload.peerId];
    return {
      ...newState,
    };
  }

  if (action.type === 'ADD_ALL_PEERS') {
    return { ...state, ...action.peers };
  }

  return { ...state };
};

export const RoomContext = createContext<RoomContextData>(null);

export function RoomProvider({ children }) {
  const ws = useMemo(() => {
    return io(process.env.NEXT_PUBLIC_SERVER_URL);
  }, []);
  console.log(
    'connecting with server in URL: ',
    process.env.NEXT_PUBLIC_SERVER_URL
  );

  console.log('ws', ws);

  const [myPeer, setMyPeer] = useState<PeerObj>();

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();

  const [peers, dispatchPeers] = useReducer(peersReducer, {});
  const [allUsers, setAllUsers] = useState<Array<IUserDto>>([]);

  console.log('peers', peers);

  const getUsers = users => {
    console.log('all users in the room ', users);
    setAllUsers(users);
    dispatchPeers({ type: 'ADD_ALL_PEERS', payload: { peers: users } });
  };

  const removePeer = (peerId: { peerId: string }) => {
    dispatchPeers({ type: 'REMOVE_PEER_STREAM', payload: { peerId } });
  };

  const toggleMicrophone = () => {
    const newStream = stream;
    newStream.getTracks().find(t => t.kind === 'audio').enabled = !stream
      .getTracks()
      .find(t => t.kind === 'audio').enabled;
    setStream(newStream);
  };

  const switchStreamToScreen = async () => {
    try {
      const constraints = {
        video: true,
        audio: true,
      };

      const newStream = isSharing
        ? await navigator.mediaDevices.getUserMedia(constraints)
        : await navigator.mediaDevices.getDisplayMedia(constraints);

      const attStream = stream;
      const currentVideoTrack = attStream
        .getTracks()
        .find(t => t.kind === 'video');

      if (currentVideoTrack) {
        attStream.removeTrack(currentVideoTrack);
        attStream.addTrack(newStream.getTracks().find(t => t.kind === 'video'));
      }
      setStream(attStream);
      setIsSharing(v => !v);

      const sharer = {
        sharerId: myPeer.id,
        sharing: !isSharing,
      };

      ws.emit('screenShare', sharer);

      Object.values(myPeer?.connections).forEach(conn => {
        const videoTrack = newStream
          ?.getTracks()
          .find(track => track.kind === 'video');

        conn[0].peerConnection
          .getSenders()[1]
          .replaceTrack(videoTrack)
          .catch(err => {
            console.log('erro ao mudar stream', err);
          });
      });
    } catch (err) {
      console.log('err on switch stream', err);
    }
  };

  useEffect(() => {
    if (typeof window === undefined) return;
    // const savedId = localStorage.getItem('userId');
    // const meId = savedId || uuid();
    const meId = uuid();

    // localStorage.setItem('userId', meId);

    if (typeof navigator !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Peer = require('peerjs').default;
      const peer = new Peer(meId);
      setMyPeer(peer);

      try {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          // .getUserMedia({ audio: true })
          .then(getStream => {
            setStream(getStream);
          });
      } catch (error) {
        console.error('user denied permission', error);
      }

      ws.on('get-all-users-connected', getUsers);
      ws.on('user-disconnected', removePeer);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      ws.off('get-all-users-connected');
      ws.off('user-disconnected');

      myPeer?.disconnect();
    };
  }, []);

  useEffect((): (() => void) => {
    if (!myPeer) return;
    if (!stream) return;

    ws.on('user-joined', (user: IUserDto) => {
      console.log('user joined in room: ', user);
      setAllUsers(v => [...v, user]);
      const call = myPeer.call(user.peerId, stream, {
        metadata: { username: user.username },
      });

      call.on('stream', remotePeerStream => {
        console.log('other peer receiving stream: ', user.username);
        dispatchPeers({
          type: 'ADD_PEER_STREAM',
          payload: {
            peerId: user.peerId,
            stream: remotePeerStream,
            username: user.username,
          },
        });
      });
    });

    myPeer.on('call', call => {
      const { username } = call.metadata;
      call.answer(stream);

      call.on('stream', remotePeerStream => {
        console.log('my peer recieving stream: ', remotePeerStream);
        dispatchPeers({
          type: 'ADD_PEER_STREAM',
          payload: { peerId: call.peer, stream: remotePeerStream, username },
        });
      });
    });

    // eslint-disable-next-line consistent-return
    return () => {
      ws.off('user-joined');
    };
  }, [myPeer, stream]);

  return (
    <RoomContext.Provider
      value={{
        ws,
        myPeer,
        peers,
        stream,
        toggleMicrophone,
        isSharing,
        switchStreamToScreen,
        allUsers,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => useContext(RoomContext);
