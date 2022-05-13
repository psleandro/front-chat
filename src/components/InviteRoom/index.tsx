import { useEffect, useState } from 'react';
import { Button, Card, Typography, Input } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { v4 as newUuid } from 'uuid';
import { useRouter } from 'next/router';
import * as S from './styles';
import { useAuth } from '../../contexts/auth';
import { createUserDto } from '../../interfaces';
import { useRoom } from '../../contexts';

export function InviteRoom() {
  const [name, setName] = useState('');

  // const { signIn } = useAuth();
  const { ws } = useRoom();
  const router = useRouter();

  const { roomId } = router.query;

  const joinInMeet = (toRoomID: string) => {
    const userId = newUuid();
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const user: createUserDto = {
      userId,
      username: name,
      color,
    };
    // signIn(user);
    router.push(`/room/${toRoomID}`);
  };

  const validateInvite = (isValid: boolean) => {
    if (isValid) return;
    router.push('/');
  };

  useEffect(() => {
    if (!roomId || !ws) return;

    ws.on('res-room-invite-verification', validateInvite);
    ws.emit('req-room-invite-verification', roomId);

    // eslint-disable-next-line consistent-return
    return () => {
      ws.off('res-room-invite-verification');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, ws]);

  return (
    <S.Center>
      <Card
        title="Meet Time - Convite para conferência"
        style={{ width: '50%' }}
      >
        <S.Content>
          <S.InputContainer>
            <Typography.Text type={name ? 'secondary' : 'danger'}>
              Nome de usuário
            </Typography.Text>
            <Input
              status={name ? '' : 'error'}
              placeholder="Digite seu nome para entrar na sala."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </S.InputContainer>
          {name && (
            <Button
              type="primary"
              disabled={!name}
              onClick={() =>
                joinInMeet(typeof roomId === 'string' ? roomId : '')
              }
            >
              Entrar
              <ArrowRightOutlined />
            </Button>
          )}
        </S.Content>
      </Card>
    </S.Center>
  );
}
