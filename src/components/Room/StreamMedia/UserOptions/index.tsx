import { useState } from 'react';
import { Button } from 'antd';
import {
  AudioMutedOutlined,
  AudioOutlined,
  CameraOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { useRoom } from '../../../../contexts';
import * as S from '../styles';

export function UserOptions() {
  const [muted, setMuted] = useState<boolean>(false);
  const { isSharing, toggleMicrophone, switchStreamToScreen } = useRoom();

  const handleToggleMicrophone = () => {
    toggleMicrophone();
    setMuted(v => !v);
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
      {/*  <Button
        size="large"
        shape="circle"
        onClick={() => toggleMicrophone()}
        icon={<CameraOutlined />}
      /> */}
    </S.FooterOptions>
  );
}
