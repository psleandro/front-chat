/* eslint-disable global-require */
import { useRouter } from 'next/router';
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
import { RoomContextData, IUserDto, PeerState } from '../interfaces';

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

  const router = useRouter();

  const { roomId } = router.query;

  const [myPeer, setMyPeer] = useState<PeerObj>();

  const [mutedUsers, setMutedUsers] = useState<string[]>([]);

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();

  const [peers, dispatchPeers] = useReducer(peersReducer, {});
  const [allUsers, setAllUsers] = useState<Array<IUserDto>>([]);

  const getUsers = users => {
    setAllUsers(users);
    dispatchPeers({ type: 'ADD_ALL_PEERS', payload: { peers: users } });
  };

  const removePeer = (peerId: { peerId: string }) => {
    dispatchPeers({ type: 'REMOVE_PEER_STREAM', payload: { peerId } });
  };

  const updateUsersMuted = (peerIds: string[]) => {
    setMutedUsers(peerIds);
  };

  const toggleMicrophone = () => {
    const newStream = stream;
    newStream.getTracks().find(t => t.kind === 'audio').enabled = !stream
      .getTracks()
      .find(t => t.kind === 'audio').enabled;
    setStream(newStream);
    ws.emit('mute-microphone', roomId, myPeer.id);
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

      const newVideoTrack = newStream.getTracks().find(t => t.kind === 'video');
      newVideoTrack.enabled = !isSharing;

      const attStream = stream;
      const currentVideoTrack = attStream
        .getTracks()
        .find(t => t.kind === 'video');

      if (currentVideoTrack) {
        attStream.removeTrack(currentVideoTrack);
        attStream.addTrack(newVideoTrack);
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
            const getedStream = getStream;
            getedStream.getTracks().find(t => t.kind === 'video').enabled =
              false;
            setStream(getedStream);
          });
      } catch (error) {
        console.error('user denied permission', error);
      }

      ws.on('get-all-users-connected', getUsers);
      ws.on('user-disconnected', removePeer);
      ws.on('update-users-muted', updateUsersMuted);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      ws.off('get-all-users-connected');
      ws.off('user-disconnected');
      ws.off('update-users-muted');

      myPeer?.disconnect();
    };
  }, []);

  useEffect((): (() => void) => {
    if (!myPeer) return;
    if (!stream) return;

    ws.on('user-joined', (user: IUserDto) => {
      ws.emit('verifySharer', roomId);
      const userExists = allUsers.find(usr => usr.userId === user.userId);
      if (userExists) {
        const users = allUsers.map(usr =>
          usr.userId === user.userId ? user : usr
        );

        setAllUsers(users);
      } else {
        setAllUsers(v => [...v, user]);
      }

      const call = myPeer.call(user.peerId, stream, {
        metadata: { username: user.username },
      });

      call.on('stream', remotePeerStream => {
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

      const sendStream = stream;
      // eslint-disable-next-line no-param-reassign
      sendStream.onaddtrack = event => {
        console.log(`New ${event.track.kind} track added`);
      };

      call.answer(sendStream);

      call.on('stream', remotePeerStream => {
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
  }, [myPeer, stream, allUsers]);

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
        mutedUsers,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => useContext(RoomContext);
