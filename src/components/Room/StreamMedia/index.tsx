import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Avatar, Card } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import * as S from './styles';
import { IUser } from '../../../interfaces';

interface IAudioCardProps {
  user: IUser;
}

function AudioCard({ user }: IAudioCardProps) {
  const [muted, setMuted] = useState(true);

  const toggleMicrophone = () => setMuted(v => !v);

  return (
    <S.Person>
      <Avatar
        style={{ background: user.color }}
        size={{ xs: 180, sm: 240, md: 280, lg: 320, xl: 320, xxl: 320 }}
      >
        {user.username}
      </Avatar>
      {/* <audio
        src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
        autoPlay
        muted={muted}
        controls
      /> */}
    </S.Person>
  );
}

export function StreamMedia({ socket }) {
  const userMedia = useRef<HTMLAudioElement>(null);

  const [users, setUsers] = useState([]);
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);

  useEffect(() => {
    socket.on('all users connected', allUsersConnected => {
      console.log('new user entered');
      const localPeers = [];

      allUsersConnected.forEach(u => {
        // cria o peer com o listem de ouvir
        const peer = new Peer({
          initiator: true,
          trickle: false,
        });

        peer.on('receive signal from peer ', signal => {
          socket.emit('sending user signal', {
            userToSignal: u.userId,
            callerID: socket.id,
            signal,
          });
        });

        peersRef.current.push({
          peerID: u.userId,
          peer,
        });

        localPeers.push(peer);
      });

      setPeers(localPeers);
      setUsers(allUsersConnected);
    });

    socket.on('user-joined', (user: IUser) => {
      setUsers(us => [...us, user]);
    });

    socket.on('user-disconnected', (socketId: string) => {
      setUsers(us => us.filter(u => u.socketId !== socketId));
    });

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        userMedia.current.srcObject = stream;

        const myPeer = new Peer({ initiator: true, stream });
      })
      .catch(err => {
        console.log('permission denied:', err.message);
      });
  }, []);

  return (
    <S.MediaContent>
      <S.Person>
        <Avatar
          size={{ xs: 180, sm: 240, md: 280, lg: 320, xl: 320, xxl: 320 }}
          icon={<AntDesignOutlined />}
        />
        {/* <audio ref={userMedia} controls /> */}
      </S.Person>

      {/* {peers?.map(peer => (
        <AudioCard />
      ))} */}
      {users?.map(peer => (
        <AudioCard user={peer} />
      ))}
    </S.MediaContent>
  );
}
