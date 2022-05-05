import { useState } from 'react';
import { Button } from 'antd';
import {
  AudioMutedOutlined,
  AudioOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { ImPhoneHangUp } from 'react-icons/im';
import { useRouter } from 'next/router';
import { useRoom } from '../../../../contexts';
import * as S from '../styles';

export function UserOptions() {
  const [muted, setMuted] = useState<boolean>(false);
  const { isSharing, toggleMicrophone, switchStreamToScreen, ws } = useRoom();

  const router = useRouter();

  const handleToggleMicrophone = () => {
    toggleMicrophone();
    setMuted(v => !v);
  };

  const disconnectRoom = () => {
    ws.disconnect();
    router.push('/');
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
      <Button
        size="large"
        shape="circle"
        onClick={() => switchStreamToScreen()}
        danger={isSharing}
        type={isSharing ? 'primary' : 'default'}
        icon={<DesktopOutlined />}
      />
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
