import { useEffect, useRef, useState } from 'react';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import * as S from '../styles';

export function PeerCard({
  stream,
  isSharing,
}: {
  stream: MediaStream;
  isSharing: boolean;
}) {
  const [isSpeaking, setIsSpeaking] = useState<number>();
  const videoStream = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (!videoStream.current && !stream) return;

    if (stream.getVideoTracks().length) {
      videoStream.current.srcObject = stream;
      getMicrophoneFrquency(stream, setIsSpeaking);
    }
  }, [stream]);

  return (
    <S.VideoContainer speaking={isSpeaking}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoStream} hidden={!isSharing} autoPlay />
    </S.VideoContainer>
  );
}
