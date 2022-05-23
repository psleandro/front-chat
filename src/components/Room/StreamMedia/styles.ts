import styled, { css } from 'styled-components';

interface IVideoProps {
  speaking: number;
  isSharing?: boolean;
  isPeerSharing?: boolean;
}

interface IUserCard extends IVideoProps {
  isSharing: boolean;
}

export const StreamArea = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1rem;
`;

export const MediaContent = styled.main`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 1rem;
  padding: 1rem;
  height: calc(100% - 40px);

  @media (max-width: 540px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
`;

export const Person = styled.div`
  width: 480px;
  flex: 1 1 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: '#FFF';

  h1 {
    color: #fff;
  }
`;

export const VideoContainer = styled.div<IVideoProps>`
  position: relative;
  width: 480px;
  height: 360px;
  flex: 1 1 80px;
  display: flex;
  flex-direction: column;

  background: #333;

  border-radius: 12px;

  overflow: hidden;
  align-items: center;
  color: '#FFF';
  /* object-fit: fill; */
  text-align: center;
  box-shadow: ${({ speaking }) =>
    speaking > 0 ? `0 0 ${speaking}px ${speaking}px #ff5252` : ''};

  @media (max-width: 1010px) {
    margin: 0 auto;
  }

  @media (max-width: 540px) {
    ${({ isSharing }) =>
      !isSharing &&
      css`
        width: 300px;
        height: 250px;
      `};
  }

  ${({ isSharing }) =>
    isSharing &&
    css`
      width: 100%;
      height: calc(90vh);
    `};

  ${({ isPeerSharing }) =>
    isPeerSharing &&
    css`
      display: none;
    `};

  video {
    object-fit: cover;
    text-align: center;

    ${({ isSharing }) =>
      isSharing &&
      css`
        width: 100%;
        height: 100%;
      `};
  }

  h1 {
    color: #fff;
  }
`;

export const PeerVideoContainer = styled.div<IVideoProps>`
  position: relative;
  width: 480px;
  height: 360px;
  flex: 1 1 80px;
  display: flex;
  flex-direction: column;

  background: #333;

  border-radius: 12px;

  overflow: hidden;
  align-items: center;
  color: '#FFF';
  /* object-fit: fill; */
  text-align: center;
  box-shadow: ${({ speaking }) =>
    speaking > 0 ? `0 0 ${speaking}px ${speaking}px #ff5252` : ''};

  @media (max-width: 1010px) {
    margin: 0 auto;
  }

  @media (max-width: 540px) {
    ${({ isPeerSharing }) =>
      !isPeerSharing &&
      css`
        width: 300px;
        height: 250px;
      `};
  }

  ${({ isSharing }) =>
    isSharing &&
    css`
      display: none;
    `};

  ${({ isPeerSharing }) =>
    isPeerSharing &&
    css`
      width: 100%;
      height: calc(90vh);
    `};

  ${({ isPeerSharing }) =>
    !isPeerSharing &&
    css`
      &.hide {
        display: none;
      }
    `};

  video {
    object-fit: cover;
    text-align: center;

    ${({ isPeerSharing }) =>
      isPeerSharing &&
      css`
        width: 100%;
        height: 100%;
      `};
  }

  h1 {
    color: #fff;
  }
`;

export const NameContainer = styled.h1`
  position: absolute;
  bottom: 16px;
  left: 32px;
  z-index: 100;
  color: #fff;
  font-size: 1rem;
`;

export const FooterOptions = styled.div`
  display: flex;
  gap: 8px;
  align-self: center;
  align-items: center;
`;

export const UserCard = styled.div<IUserCard>`
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  flex: 1;

  ${({ isSharing }) =>
    isSharing &&
    css`
      display: none;
    `}

  img {
    border-radius: 50%;
  }
`;
