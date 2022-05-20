import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useRoom } from '../../../../contexts';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import * as S from '../styles';

export function PeerCard({
  stream,
  isSharing: isPeerSharing,
  peerId,
  peerSharing,
}: {
  stream: MediaStream;
  isSharing: boolean;
  peerId: string;
  peerSharing: string;
}) {
  const [isSpeaking, setIsSpeaking] = useState<number>();
  const videoStream = useRef<HTMLVideoElement>();

  const { allUsers, isSharing } = useRoom();

  useEffect(() => {
    if (!videoStream.current && !stream) return;

    if (stream.getVideoTracks().length) {
      videoStream.current.srcObject = stream;
      getMicrophoneFrquency(stream, setIsSpeaking);
    }
  }, [stream]);

  const userImgPath = useMemo(() => {
    const user = allUsers.find(u => u.peerId === peerId);
    if (user?.provider === 'google.com') {
      return user?.image;
    }
    if (user?.provider === 'microsoft.com')
      return `data:image/jpeg;base64,${user?.image}`;

    return '/avatar/default-1.png';
  }, [allUsers, peerId]);

  return (
    <S.PeerVideoContainer
      speaking={isSpeaking}
      isSharing={isSharing}
      isPeerSharing={isPeerSharing}
      className={
        !!peerSharing && !isPeerSharing && peerId !== peerSharing && 'hide'
      }
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoStream} hidden={!isPeerSharing} autoPlay />
      <S.UserCard speaking={isSpeaking} isSharing={isPeerSharing}>
        <Image src={userImgPath} width={150} height={150} alt="avatar" />
      </S.UserCard>
      <S.NameContainer>
        {allUsers.find(u => u.peerId === peerId).name}
      </S.NameContainer>
    </S.PeerVideoContainer>
  );
}
