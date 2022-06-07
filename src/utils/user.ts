import { IUser } from '../interfaces';

export const getImageUrl = (user: IUser): string => {
  if (user?.provider === 'google.com') {
    return user?.image;
  }
  if (user?.provider === 'microsoft.com' && user?.image)
    return `data:image/jpeg;base64,${user?.image}`;

  return '/avatar/default-1.png';
};
