import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Avatar, Button, Card } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import * as S from './styles';
import { IUser } from '../../../interfaces';
import { useAuth } from '../../../contexts/auth';

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

function PeerCard({ peer, user }: any) {
  const receivedStreamRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    peer.on('stream', stream => {
      receivedStreamRef.current.srcObject = stream;
    });
  }, []);

  return (
    <S.Person>
      <Avatar
        style={{ backgroundColor: user?.color, border: '3px solid #fff' }}
        size={{ xs: 180, sm: 240, md: 280, lg: 320, xl: 320, xxl: 320 }}
      >
        {user?.username}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={receivedStreamRef} autoPlay />
      </Avatar>
      {/*
      <h1>{user.username}</h1> */}
    </S.Person>
  );
}

export function StreamMedia({ socket }) {
  const { user } = useAuth();
  const userMedia = useRef<HTMLAudioElement>(null);

  const [users, setUsers] = useState([]);
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);

  useEffect(() => {
    socket.on('all users connected', allUsersConnected => {
      console.log('entered in room with users: ', allUsersConnected);
      const localPeers = [];

      allUsersConnected.forEach((u: IUser) => {
        const userPeer = new Peer({
          initiator: true,
          trickle: false,
        });

        userPeer.on('signal', signal => {
          console.log(`user: ${u.userId} - ${u.username} recebendo o sinal!`);

          socket.emit('request connection to user', {
            userToSignal: u.socketId,
            callerId: socket.id,
            signal,
          });
        });

        peersRef.current.push({
          peerId: u.socketId,
          peer: userPeer,
        });
        localPeers.push(userPeer);
      });

      setPeers(localPeers);
      setUsers(allUsersConnected);
    });

    socket.on('receive request from user joined', data => {
      console.log(
        `New request from user: ${data.caller.socketId}, with signal: `,
        data.signal
      );
      console.log(data.caller);
      const newUserPeer = new Peer({
        initiator: false,
        trickle: false,
      });

      newUserPeer.on('signal', signal => {
        socket.emit('response user-joined request', {
          signal,
          callerId: data.caller.socketId,
        });
      });

      newUserPeer.signal(data.signal);

      peersRef.current.push({
        peerId: data.caller.socketId,
        peer: newUserPeer,
      });

      setPeers(ps => [...ps, newUserPeer]);
      setUsers(us => [...us, data.caller]);
    });

    socket.on('receiving final signal response', data => {
      console.log('pegando o sinal final de: ', data);
      const item = peersRef.current.find(p => p.peerId === data.userToSignalId);
      item.peer.signal(data.signal);
    });

    socket.on('user-disconnected', (socketId: string) => {
      // peersRef.current = peersRef.current.filter(p => p.peerId !== socketId);
      // setPeers(ps => ps.filter(p => p.peerId !== socketId));
      setUsers(us => us.filter(u => u.socketId !== socketId));
    });

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        userMedia.current.srcObject = stream;
      })
      .catch(err => {
        console.log('permission denied:', err.message);
      });
  }, []);

  return (
    <S.MediaContent>
      <S.Person>
        <Avatar
          style={{ backgroundColor: user?.color, border: '3px solid #fff' }}
          size={{ xs: 180, sm: 240, md: 280, lg: 320, xl: 320, xxl: 320 }}
        >
          EU
          <audio ref={userMedia} muted autoPlay />
        </Avatar>
      </S.Person>

      {peers?.map((peer, index) => {
        return <PeerCard peer={peer} user={users[index]} />;
      })}
    </S.MediaContent>
  );
}
