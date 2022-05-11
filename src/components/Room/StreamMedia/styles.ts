import styled, { css } from 'styled-components';

interface IVideoProps {
  speaking: number;
}

interface IUserCard extends IVideoProps {
  isSharing: boolean;
}

export const StreamArea = styled.main`
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

export const MediaContent = styled.main`
  /* display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
  gap: 12px; */
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
`;

export const Person = styled.div`
  margin: 12px;
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
  margin: 12px;
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
  object-fit: fill;
  text-align: center;
  box-shadow: ${({ speaking }) =>
    speaking > 0 ? `0 0 ${speaking}px ${speaking}px #ff5252` : ''};

  video {
    width: 480px;
    height: 360px;
    object-fit: cover;
    text-align: center;
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
