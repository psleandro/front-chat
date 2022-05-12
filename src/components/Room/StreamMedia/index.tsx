import { useEffect, useState } from 'react';
import { v1 as uuid } from 'uuid';
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

  // const peerArr = new Array(6).fill({
  //   peerId: uuid(),
  //   stream: new MediaStream(),
  // });

  useEffect(() => {
    socket.on('sharer', data => {
      if (data.sharing) setUserSharingId(data.sharerId);
      else setUserSharingId(undefined);
    });
  }, [socket]);

  return (
    <S.StreamArea>
      <S.MediaContent>
        <MyStreamCard peerSharing={userSharingId} />
        {Object.values(peersToShow as PeerState).map(peer => (
          <PeerCard
            stream={peer.stream}
            isSharing={peer.id === userSharingId}
            peerId={peer.id}
          />
        ))}
        {/* {peerArr.map(peer => (
          <PeerCard
            stream={peer.stream}
            isSharing={peer.id === userSharingId}
            peerId={peer.id}
          />
        ))} */}
      </S.MediaContent>
      <UserOptions />
    </S.StreamArea>
  );
}
