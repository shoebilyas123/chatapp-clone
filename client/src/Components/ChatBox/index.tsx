import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { IGlobalState } from '../../Interface/redux';

interface IProps {
  chatHistory?: any;
}

const DUMMY_DATA = [
  {
    from: 'ME',
    message: 'Hello guys how are you',
    sentAt: Date.now() - 20000,
  },
  {
    from: 'FRIEND',
    message: 'Hi, I am fine. Just landed in Germany',
    sentAt: Date.now() - 10000,
  },
  {
    from: 'ME',
    message: 'Great to hear that.',
    sentAt: Date.now(),
  },
];

const ChatBox: React.FC<IProps> = () => {
  const { chatInfo } = useSelector((state: IGlobalState) => state);

  if (chatInfo?.socket) {
    chatInfo.socket.on('messageFromServer', (message: any) => {
      console.log(message);
    });
  }

  return (
    <Card className="m-2 ml-0" style={{ height: '90%' }}>
      <Card.Header>{chatInfo?.name || ''}</Card.Header>
      <Card.Body style={{ position: 'relative' }}>
        {DUMMY_DATA.map((data) => (
          <ChatMessage
            message={data.message}
            from={data.from}
            sentAt={new Date(data.sentAt).toLocaleString()}
            key={Math.random().toString(36)}
          />
        ))}
        <MessageInput />
      </Card.Body>
    </Card>
  );
};

export default ChatBox;
