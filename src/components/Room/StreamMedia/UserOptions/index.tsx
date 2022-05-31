import { useState } from 'react';
import { Button } from 'antd';
import {
  AudioMutedOutlined,
  AudioOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { ImPhoneHangUp } from 'react-icons/im';
import { useRouter } from 'next/router';
import { useAuth, useRoom } from '../../../../contexts';
import * as S from '../styles';

export function UserOptions({ userSharing }: { userSharing: string }) {
  const [muted, setMuted] = useState<boolean>(false);
  const {
    isSharing,
    toggleMicrophone,
    switchStreamToScreen,
    ws,
    isMicrophoneMuted,
    myPeer,
  } = useRoom();

  const { setUser } = useAuth();

  const router = useRouter();

  const handleToggleMicrophone = () => {
    toggleMicrophone();
    setMuted(v => !v);
    // setUser(prev => ({
    //   ...prev,
    //   muted: !prev.muted,
    // }));
  };

  const disconnectRoom = () => {
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
      <Button
        size="large"
        shape="circle"
        onClick={() => switchStreamToScreen()}
        danger={isSharing}
        type={isSharing ? 'primary' : 'default'}
        icon={<DesktopOutlined />}
        disabled={userSharing && userSharing !== myPeer?.id}
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
