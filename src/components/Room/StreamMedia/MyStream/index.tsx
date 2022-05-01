import { useEffect, useRef, useState } from 'react';
import { useAuth, useRoom } from '../../../../contexts';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import * as S from '../styles';

export function MyStreamCard() {
  const { user } = useAuth();
  const { stream } = useRoom();

  const [isSpeaking, setIsSpeaking] = useState<number>();
  const myMedia = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (myMedia.current && stream) {
      myMedia.current.srcObject = stream;
      getMicrophoneFrquency(stream, setIsSpeaking);
    }
  }, [stream]);

  return (
    <S.VideoContainer speaking={isSpeaking}>
      <video ref={myMedia} muted autoPlay />
      <S.NameContainer>{user?.username} (EU)</S.NameContainer>
    </S.VideoContainer>
  );
}
