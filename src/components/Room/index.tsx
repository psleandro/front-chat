import { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import Router from 'next/router';
import { useAuth } from '../../contexts/auth';
import * as S from './styles';
import { Chat } from './Chat';
import { StreamMedia } from './StreamMedia';

export function Room() {
  const { user } = useAuth();

  const socket = useMemo(() => io('http://localhost:5000'), []);

  useEffect(() => {
    if (!user) {
      Router.push('/');
      return;
    }

    socket.emit('join room', user);
  }, [user]);

  return (
    <S.Container>
      <StreamMedia socket={socket} />
      <Chat socket={socket} />
    </S.Container>
  );
}
