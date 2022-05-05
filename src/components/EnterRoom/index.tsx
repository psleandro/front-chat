import { FaSignOutAlt } from 'react-icons/fa';
import { v4 as newUuid } from 'uuid';
import { useRouter } from 'next/router';
import { getSession, useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import * as S from './styles';

export function EnterRoom() {
  const { data: session } = useSession();

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
          src={session.user?.image || '/avatar/default-1.png'}
          alt={session.user?.name}
          width={200}
          height={200}
        />
      </S.Avatar>
      <S.Row>
        <h3>{session.user?.name}</h3>
        <S.Logout>
          <FaSignOutAlt onClick={() => signOut()} />
        </S.Logout>
      </S.Row>
      <S.Row>
        <S.Button
          onClick={() => createMeet()}
          disabled={
            !!(session.user?.name === undefined || session.user?.name === '')
          }
          locked={
            !!(session.user?.name === undefined || session.user?.name === '')
          }
        >
          Criar Sala
        </S.Button>
      </S.Row>
    </S.Column>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/' });
    context.res.end();
    return {};
  }
  return {
    props: {
      user: session.user,
    },
  };
}
