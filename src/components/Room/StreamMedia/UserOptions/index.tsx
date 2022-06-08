import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import {
  AudioMutedOutlined,
  AudioOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { ImPhoneHangUp } from 'react-icons/im';
import { useRouter } from 'next/router';
import { useRoom } from '../../../../contexts';
import * as S from '../styles';

export function UserOptions({ userSharing }: { userSharing: string }) {
  const [muted, setMuted] = useState<boolean>(false);
  const {
    ws,
    myPeer,
    allUsers,
    isSharing,
    toggleMicrophone,
    switchStreamToScreen,
  } = useRoom();

  const router = useRouter();

  const handleToggleMicrophone = () => {
    toggleMicrophone();
    setMuted(v => !v);
  };

  const disconnectRoom = () => {
    if (isSharing) {
      switchStreamToScreen();
    }
    ws.disconnect();
    router.push('/');
    ws.connect();
  };

  return (
    <S.FooterOptions>
      <Button
        size="large"
        shape="circle"
        danger={muted}
        type={muted ? 'primary' : 'default'}
        onClick={() => handleToggleMicrophone()}
      >
        {muted ? <AudioMutedOutlined /> : <AudioOutlined />}
      </Button>
      <Tooltip
        color="#ff5252"
        title={
          // eslint-disable-next-line no-nested-ternary
          userSharing
            ? userSharing === myPeer?.id
              ? 'Parar de Compartilhar'
              : `${
                  allUsers.find(u => u.peerId === userSharing)?.name
                } já está compartilhando a tela.`
            : 'Compartilhar Tela'
        }
      >
        <Button
          size="large"
          shape="circle"
          onClick={() => switchStreamToScreen()}
          danger={isSharing}
          type={isSharing ? 'primary' : 'default'}
          icon={<DesktopOutlined />}
          disabled={userSharing && userSharing !== myPeer?.id}
        />
      </Tooltip>
      <Button
        size="large"
        shape="circle"
        onClick={() => disconnectRoom()}
        icon={<ImPhoneHangUp />}
        style={{ background: 'red', color: '#fff' }}
      />
    </S.FooterOptions>
  );
}
