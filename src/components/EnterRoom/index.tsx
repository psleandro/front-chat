import { FaSignOutAlt } from 'react-icons/fa';
import { v4 as newUuid } from 'uuid';
import { useRouter } from 'next/router';
import Image from 'next/image';
import * as S from './styles';
import { useAuth } from '../../contexts';

export function EnterRoom() {
  const { user, handleSignOut } = useAuth();

  const router = useRouter();

  const joinInMeet = (toRoomID: string) => {
    router.push(`/room/${toRoomID}`);
  };

  const createMeet = () => {
    const newRoomID = newUuid();
    joinInMeet(newRoomID);
  };

  return (
    <S.Column>
      <S.Avatar>
        <Image
          src={user?.image || '/avatar/default-1.png'}
          alt={user?.name}
          width={200}
          height={200}
        />
      </S.Avatar>
      <S.Row>
        <h3>{user?.name}</h3>
        <S.Logout>
          <FaSignOutAlt onClick={handleSignOut} />
        </S.Logout>
      </S.Row>
      <S.Row>
        <S.Button
          onClick={() => createMeet()}
          disabled={!!(user?.name === undefined || user?.name === '')}
          locked={!!(user?.name === undefined || user?.name === '')}
        >
          Criar Sala
        </S.Button>
      </S.Row>
    </S.Column>
  );
}
