import { Button as AntdButton } from 'antd';
import styled from 'styled-components';

export const ChatContent = styled.div`
  background-color: #fff;
  margin: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChatMessages = styled.div`
  flex: 1;
`;

export const IconButton = styled(AntdButton)`
  padding: 0px;
  margin: 12px;
`;
