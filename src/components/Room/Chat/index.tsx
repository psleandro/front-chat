import { useEffect, useState } from 'react';
import { v4 as newUuid } from 'uuid';
import { Input, Button, Drawer, Avatar, Comment, Typography } from 'antd';
import {
  VerticalRightOutlined,
  VerticalLeftOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';

import * as S from './styles';
import { useAuth } from '../../../contexts/auth';

function SendMessage({ user, socket }) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message) return;

    const sent_at = new Date().toLocaleTimeString();
    const messageObject = {
      userId: user.userId,
      username: user.username,
      color: user.color,
      messageId: newUuid(),
      message,
      sent_at,
    };

    socket.emit('sendMessage', messageObject);

    setMessage('');
  };

  return (
    <Input.Group
      compact
      style={{ width: '340px', display: 'flex', alignItems: 'center' }}
    >
      <Input.TextArea
        itemType="submit"
        onKeyDown={e =>
          e.keyCode === 13 && e.shiftKey === false && handleSendMessage()
        }
        placeholder="Envie uma mensagem"
        autoSize={{ minRows: 1, maxRows: 6 }}
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <Button type="primary" onClick={() => handleSendMessage()}>
        <CaretRightOutlined />
      </Button>
    </Input.Group>
  );
}

function Messages({ socket }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('all messages history', msgData => {
      setMessages(msgData);
    });

    socket.on('received message', msg => {
      setMessages(msgs => [...msgs, msg]);
    });
  }, [socket]);

  return (
    <S.ChatMessages>
      {messages.map(m => (
        <Comment
          key={m.messageId}
          author={<Typography.Text strong>{m.username}</Typography.Text>}
          avatar={
            <Avatar style={{ backgroundColor: m.color }}>{m.username}</Avatar>
          }
          datetime={m.sent_at}
          content={
            <Typography.Text type="secondary">{m.message}</Typography.Text>
          }
        />
      ))}
    </S.ChatMessages>
  );
}

export function Chat({ socket }) {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(true);

  return (
    <>
      <S.IconButton type="text" onClick={() => setShowChat(v => !v)}>
        <VerticalRightOutlined style={{ color: '#fff', fontSize: '24px' }} />
      </S.IconButton>
      <Drawer
        title="CHAT DA REUNI??O"
        placement="right"
        visible={showChat}
        onClose={() => setShowChat(v => !v)}
        closeIcon={<VerticalLeftOutlined />}
        bodyStyle={{ padding: '0px' }}
        footer={<SendMessage user={user} socket={socket} />}
        mask={false}
      >
        <S.ChatContent>
          <Messages socket={socket} />
        </S.ChatContent>
      </Drawer>
    </>
  );
}
