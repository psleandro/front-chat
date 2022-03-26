import { Input, Button, Drawer, Avatar, Comment, Typography } from 'antd';
import {
  VerticalRightOutlined,
  VerticalLeftOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import * as S from './styles';

const arrayMessages = [
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-02',
    username: 'Gabriel Sartorato',
    sent_at: '15:59',
    message: 'Helooo!',
    color: '#1890ff',
  },
  {
    userId: 'user-03',
    username: 'Felipe',
    sent_at: '15:59',
    message: 'Nice chat guys',
    color: '#87d068',
  },
  {
    userId: 'user-04',
    username: 'Luis',
    sent_at: '15:59',
    message: 'Cara nada ver isso ai',
    color: '#34c6eb',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
  {
    userId: 'user-01',
    username: 'Leandro Santos',
    sent_at: '15:59',
    message:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure)',
    color: '#f56a00',
  },
];

function SendMessage() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message) return;
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

function Messages() {
  return (
    <S.ChatMessages>
      {arrayMessages.map(m => (
        <Comment
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

export function Chat() {
  const [showChat, setShowChat] = useState(true);

  return (
    <>
      <S.IconButton type="text" onClick={() => setShowChat(v => !v)}>
        <VerticalRightOutlined style={{ color: '#fff', fontSize: '24px' }} />
      </S.IconButton>
      <Drawer
        title="CHAT DA REUNIÃO"
        placement="right"
        visible={showChat}
        onClose={() => setShowChat(v => !v)}
        closeIcon={<VerticalLeftOutlined />}
        bodyStyle={{ padding: '0px' }}
        footer={<SendMessage />}
        mask={false}
      >
        <S.ChatContent>
          <Messages />
        </S.ChatContent>
      </Drawer>
    </>
  );
}
