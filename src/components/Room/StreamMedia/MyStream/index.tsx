import { useEffect, useRef, useState } from 'react';
import { useRoom } from '../../../../contexts';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import * as S from '../styles';

export function MyStreamCard() {
  const { stream, isSharing } = useRoom();

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
      <video ref={myMedia} hidden={!isSharing} muted autoPlay />
      <S.NameContainer>Você</S.NameContainer>
    </S.VideoContainer>
  );
}
