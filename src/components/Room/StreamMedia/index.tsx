import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Avatar, Card } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import * as S from './styles';

function AudioCard() {
  const [muted, setMuted] = useState(true);

  const toggleMicrophone = () => setMuted(v => !v);

  return (
    <S.Person>
      <Avatar
        size={{ xs: 180, sm: 240, md: 280, lg: 320, xl: 320, xxl: 320 }}
      />
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

  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);

  const getUserStream = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        userMedia.current.srcObject = stream;

        const myPeer = new Peer({ initiator: true, stream });

        socket.on('all users connected', allUsersConected => {
          console.log('receiving all users: ', allUsersConected);
        });
      })
      .catch(err => {
        console.log('permission denied:', err.message);
        // const peer2 = new Peer();
        // peer2.on('signal', data => {
        //   console.log('peer 2 recebendo signal também:', data);
        //   peer1.signal(data);
        // });
      });
  };

  useEffect(() => {
    socket.on('all users connected', allUsersConnected => {
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
        <audio ref={userMedia} controls />
      </S.Person>

      {peers?.map(peer => (
        <AudioCard />
      ))}
    </S.MediaContent>
  );
}
