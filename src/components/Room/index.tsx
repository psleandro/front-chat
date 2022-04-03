import { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/auth';
import * as S from './styles';
import { Chat } from './Chat';
import { StreamMedia } from './StreamMedia';

export function Room() {
  const { user } = useAuth();
  const router = useRouter();

  const { roomId } = router.query;

  const socket = useMemo(() => io(process.env.NEXT_PUBLIC_SERVER_URL), []);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    socket.emit('join room', roomId, user);
  }, [user, socket, router, roomId]);

  return (
    <S.Container>
      <StreamMedia socket={socket} />
      <Chat socket={socket} />
    </S.Container>
  );
}
