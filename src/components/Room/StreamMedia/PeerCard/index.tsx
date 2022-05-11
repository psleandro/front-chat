import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRoom } from '../../../../contexts';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import * as S from '../styles';

export function PeerCard({
  stream,
  isSharing: isPeerSharing,
  peerId,
}: {
  stream: MediaStream;
  isSharing: boolean;
  peerId: string;
}) {
  const [isSpeaking, setIsSpeaking] = useState<number>();
  const videoStream = useRef<HTMLVideoElement>();

  const { allUsers, isSharing } = useRoom();

  console.log('all users here: ', allUsers);
  console.log(
    'the user: ',
    allUsers.find(u => u.peerId === peerId)
  );

  useEffect(() => {
    if (!videoStream.current && !stream) return;

    if (stream.getVideoTracks().length) {
      videoStream.current.srcObject = stream;
      getMicrophoneFrquency(stream, setIsSpeaking);
    }
  }, [stream]);

  return (
    <S.PeerVideoContainer
      speaking={isSpeaking}
      isSharing={isSharing}
      isPeerSharing={isPeerSharing}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoStream} hidden={!isPeerSharing} autoPlay />
      <S.UserCard speaking={isSpeaking} isSharing={isPeerSharing}>
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
    </S.PeerVideoContainer>
  );
}
