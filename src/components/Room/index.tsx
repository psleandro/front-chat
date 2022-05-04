import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, notification } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useAuth, useRoom } from '../../contexts';
import * as S from './styles';
import { Chat } from './Chat';
import { StreamMedia } from './StreamMedia';

export function Room() {
  const { user } = useAuth();
  const { ws, myPeer, stream } = useRoom();
  const router = useRouter();

  const { roomId } = router.query;

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    if (myPeer && stream) {
      // eslint-disable-next-line no-underscore-dangle
      ws.emit('join-room', roomId, { ...user, peerId: myPeer._id });
    }
  }, [ws, user, stream, myPeer, router, roomId]);

  useEffect(() => {
    const openNotification = () => {
      const inviteUrl = `${window.location.hostname}:${window.location.port}/invite/${roomId}`;
      notification.info({
        message: 'Convide outras pessoas!',
        description: (
          <>
            <p>Envie o link da reunião com quem você quer que participe</p>
            <Input.Group compact>
              <Input
                value={inviteUrl}
                style={{ width: 'calc(100% - 40px)' }}
                disabled
              />
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(inviteUrl);
                }}
              />
            </Input.Group>
          </>
        ),
        placement: 'bottomLeft',
      });
    };

    if (!roomId || !user) return;
    openNotification();
  }, [roomId, user]);

  return (
    <S.Container>
      <StreamMedia socket={ws} />
      {/* <Chat socket={ws} /> */}
    </S.Container>
  );
}
