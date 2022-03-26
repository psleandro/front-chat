import { useState } from 'react';
import { Button, Card, Typography, Input } from 'antd';
import {
  PhoneOutlined,
  ArrowRightOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { v4 as newUuid } from 'uuid';
import { useRouter } from 'next/router';
import * as S from './styles';

export function EnterRoom() {
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');

  const router = useRouter();

  const joinInMeet = () => {
    router.push(`/room/${roomID}`);
  };

  const createMeet = () => {
    const newRoomID = newUuid();
    router.push(`/room/${newRoomID}`);
  };

  return (
    <S.Center>
      <Card title="Meet Time" style={{ width: '50%' }}>
        <S.Content>
          <div>
            <Typography.Text type={name ? 'secondary' : 'danger'}>
              Nome de usuário
            </Typography.Text>
            <Input
              status={name ? '' : 'error'}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <S.Actions>
            <Button
              type="primary"
              icon={<PhoneOutlined />}
              disabled={!name}
              onClick={() => createMeet()}
            >
              Nova Reunião
            </Button>

            <S.ButtonGroup>
              <Input
                prefix={<FormOutlined />}
                placeholder="Digite um código para entrar em uma sala existente."
                value={roomID}
                onChange={e => setRoomID(e.target.value)}
              />
              {roomID && (
                <Button
                  type="primary"
                  disabled={!roomID || !name}
                  onClick={() => joinInMeet()}
                >
                  Entrar
                  <ArrowRightOutlined />
                </Button>
              )}
            </S.ButtonGroup>
          </S.Actions>
        </S.Content>
      </Card>
    </S.Center>
  );
}
