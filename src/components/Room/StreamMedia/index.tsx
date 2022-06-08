import { useEffect, useState } from 'react';
import * as S from './styles';
import { PeerState } from '../../../interfaces';
import { useRoom } from '../../../contexts';
import { MyStreamCard } from './MyStream';
import { UserOptions } from './UserOptions';
import { PeerCard } from './PeerCard';

export function StreamMedia({ socket }) {
  const { peers } = useRoom();

  const { ...peersToShow } = peers;

  const [userSharingId, setUserSharingId] = useState();

  useEffect(() => {
    socket.on('sharer', data => {
      if (data?.sharing) setUserSharingId(data.sharerId);
      else setUserSharingId(undefined);
    });
  }, [socket]);

  return (
    <S.StreamArea>
      <S.MediaContent>
        <MyStreamCard peerSharing={userSharingId} />
        {Object.values(peersToShow as PeerState).map(peer => (
          <PeerCard
            key={peer.id}
            stream={peer.stream}
            isSharing={peer.id === userSharingId}
            peerId={peer.id}
            peerSharing={userSharingId}
          />
        ))}
      </S.MediaContent>
      <UserOptions userSharing={userSharingId} />
    </S.StreamArea>
  );
}
