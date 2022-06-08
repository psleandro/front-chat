import { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { v4 as newUuid } from 'uuid';
import { useRouter } from 'next/router';
import Image from 'next/image';
import * as S from './styles';
import { useAuth } from '../../contexts';
import { AvatarPicker } from '../AvatarPicker';

export function EnterRoom() {
  const { user, handleSignOut, userImage } = useAuth();
  const [isAvatarPickerVisible, setIsAvatarPickerVisible] = useState(false);

  const router = useRouter();

  const joinInMeet = (toRoomID: string) => {
    router.push(`/room/${toRoomID}`);
  };

  const createMeet = () => {
    const newRoomID = newUuid();
    joinInMeet(newRoomID);
  };

  const closeModal = () => {
    setIsAvatarPickerVisible(false);
  };

  return (
    <>
      <S.Column>
        <S.Button
          background="#556ee6"
          onClick={() => setIsAvatarPickerVisible(true)}
        >
          Selecionar Avatar
        </S.Button>
        <S.Avatar>
          <Image src={userImage} alt={user?.name} width={200} height={200} />
          {/* <img src={`data:image/jpeg;base64,${user.image}`} alt="" /> */}
        </S.Avatar>
        <S.Row>
          <h3>{user?.name}</h3>
          <S.Logout>
            <FaSignOutAlt onClick={handleSignOut} />
          </S.Logout>
        </S.Row>
        <S.Row>
          <S.Button
            background="#6614d2"
            onClick={() => createMeet()}
            disabled={!!(user?.name === undefined || user?.name === '')}
            locked={!!(user?.name === undefined || user?.name === '')}
          >
            Criar Sala
          </S.Button>
        </S.Row>
      </S.Column>
      <AvatarPicker
        visible={isAvatarPickerVisible}
        centered
        footer={null}
        onCancel={closeModal}
        width="100%"
      />
    </>
  );
}
