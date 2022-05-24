import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AudioMutedOutlined } from '@ant-design/icons';
import { useAuth, useRoom } from '../../../../contexts';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import * as S from '../styles';

export function MyStreamCard({ peerSharing }: { peerSharing: string }) {
  const { stream, isSharing, myPeer, isMicrophoneMuted } = useRoom();
  const { user } = useAuth();

  const [isSpeaking, setIsSpeaking] = useState<number>();
  const myMedia = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (myMedia.current && stream) {
      myMedia.current.srcObject = stream;
      getMicrophoneFrquency(stream, setIsSpeaking);
    }
  }, [stream]);

  return (
    <S.VideoContainer
      speaking={isSpeaking}
      isSharing={isSharing}
      isPeerSharing={!!peerSharing && myPeer?.id !== peerSharing}
    >
      <video ref={myMedia} hidden={!isSharing} muted autoPlay />
      <S.UserCard speaking={isSpeaking} isSharing={isSharing}>
        <Image
          src={
            // eslint-disable-next-line no-nested-ternary
            user?.provider === 'google.com'
              ? user?.image
              : user?.image
              ? `data:image/jpeg;base64,${user?.image}`
              : '/avatar/default-1.png'
          }
          width={150}
          height={150}
          alt="avatar"
        />
      </S.UserCard>

      <S.NameContainer>Você</S.NameContainer>
      {isMicrophoneMuted && <AudioMutedOutlined />}
    </S.VideoContainer>
  );
}
