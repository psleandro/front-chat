import Image from 'next/image';
import { ModalProps } from 'antd';
import { useEffect, useState } from 'react';
import * as S from './styles';
import { useAuth } from '../../contexts';
import { avatarList } from '../../utils/avatarList';

type AvatarPickerProps = ModalProps;

export function AvatarPicker({ ...rest }: AvatarPickerProps) {
  const { user, setUser } = useAuth();
  const [currentAvatar, setCurrentAvatar] = useState(
    user.image ? user.image : '/avatar/default-1.png'
  );

  useEffect(() => {
    setUser({
      ...user,
      image: currentAvatar,
    });
  }, [currentAvatar]);

  return (
    <S.Modal {...rest}>
      <S.AvatarContainer>
        {avatarList.map(avatar => (
          <S.AvatarSelector
            type="button"
            key={Math.random()}
            selected={currentAvatar === avatar}
            onClick={() => setCurrentAvatar(avatar)}
          >
            <Image src={avatar} alt={user?.name} width={200} height={200} />
          </S.AvatarSelector>
        ))}
      </S.AvatarContainer>
    </S.Modal>
  );
}
