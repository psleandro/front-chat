import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AudioMutedOutlined } from '@ant-design/icons';
import { getMicrophoneFrquency } from '../../../../utils/audioContext';
import { getImageUrl } from '../../../../utils/user';
import { useRoom } from '../../../../contexts';
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

  const { allUsers, isSharing, mutedUsers } = useRoom();

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
      className={
        !!peerSharing && !isPeerSharing && peerId !== peerSharing && 'hide'
      }
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoStream} hidden={!isPeerSharing} autoPlay />
      <S.UserCard speaking={isSpeaking} isSharing={isPeerSharing}>
        <Image
          src={getImageUrl(allUsers.find(u => u.peerId === peerId))}
          width={150}
          height={150}
          alt="avatar"
        />
      </S.UserCard>
      <S.NameContainer>
        {allUsers.find(u => u.peerId === peerId)?.name}
      </S.NameContainer>
      {mutedUsers.includes(peerId) && <AudioMutedOutlined />}
    </S.PeerVideoContainer>
  );
}
