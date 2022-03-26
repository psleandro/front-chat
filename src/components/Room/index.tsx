import { useEffect } from 'react';
import Router from 'next/router';
import { useAuth } from '../../contexts/auth';
import { Chat } from './Chat';
import * as S from './styles';

export function Room() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) Router.push('/');
  }, [user]);

  return (
    <S.Container>
      <div>a</div>
      <Chat />
    </S.Container>
  );
}
