import * as S from './styles';
import { PeerState } from '../../../interfaces';
import { useRoom } from '../../../contexts';
import { MyStreamCard } from './MyStream';
import { UserOptions } from './UserOptions';
import { PeerCard } from './PeerCard';

export function StreamMedia() {
  const { peers } = useRoom();

  const { ...peersToShow } = peers;

  return (
    <S.StreamArea>
      <S.MediaContent>
        <MyStreamCard />
        {Object.values(peersToShow as PeerState).map(peer => (
          <PeerCard stream={peer.stream} />
        ))}
      </S.MediaContent>
      <UserOptions />
    </S.StreamArea>
  );
}
