import styled, { css } from 'styled-components';
import { Modal as AntdModal } from 'antd';

export const Modal = styled(AntdModal)``;

export const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  flex-wrap: wrap;
  gap: 2rem;
`;

interface AvatarSelectorProps {
  selected?: boolean;
}

export const AvatarSelector = styled.button<AvatarSelectorProps>`
  cursor: pointer;
  border: 1px solid ${props => (props.selected ? '#d2d233' : '#d2d2d2')};

  transition: background-color 0.2s;
  ${props =>
    props.selected &&
    css`
      background-color: #d2d233;
    `}

  &:hover {
    background-color: ${props => (props.selected ? '#d2d233' : '#d2d2d2')};
  }
`;
