import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRoom } from '../../../../contexts';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import * as S from '../styles';

export function PeerCard({
  stream,
  isSharing,
  peerId,
}: {
  stream: MediaStream;
  isSharing: boolean;
  peerId: string;
}) {
  const [isSpeaking, setIsSpeaking] = useState<number>();
  const videoStream = useRef<HTMLVideoElement>();

  const { allUsers } = useRoom();

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
      <S.UserCard speaking={isSpeaking} isSharing={isSharing}>
        <Image
          src={
            allUsers.find(u => u.peerId === peerId).image ??
            '/avatar/default-1.png'
          }
          width={150}
          height={150}
          alt="avatar"
        />
      </S.UserCard>
      <S.NameContainer>
        {allUsers.find(u => u.peerId === peerId).name}
      </S.NameContainer>
    </S.VideoContainer>
  );
}
