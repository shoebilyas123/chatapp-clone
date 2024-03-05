import React from 'react';
import { Card, Container, Row, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { IGlobalState } from '../../Interface/redux';

interface IProps {
  chatHistory?: any;
}

const ChatBox: React.FC<IProps> = () => {
  const {
    chats,
    userLogin: { userInfo },
  } = useSelector((state: IGlobalState) => state);

  React.useEffect(() => {
    const chats = document.getElementById(
      'chat-message-container-chat-app-by-shoeb-ilyas'
    );
    chats?.scrollTo(0, chats.scrollHeight);
  }, [chats]);

  return (
    <Card className="m-2 ml-0" style={{ height: '90%', maxHeight: '90%' }}>
      <Card.Header className="d-flex align-items-center">
        {`${chats?.name || ''}`.slice(0, 1).toUpperCase() +
          `${chats?.name}`.slice(1)}{' '}
        {chats?.isOnline && (
          <Badge bg="success" className="ml-2">
            Online
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        <Container>
          <Row>
            <div
              style={{
                paddingBottom: '6rem',
                minHeight: '75vh',
                maxHeight: '75vh',
                overflowY: 'scroll',
                scrollBehavior: 'smooth',
              }}
              id="chat-message-container-chat-app-by-shoeb-ilyas"
            >
              {chats &&
                chats.chatHistory.length > 0 &&
                (chats?.chatHistory || []).map((data: any) => (
                  <ChatMessage
                    message={data.message}
                    from={data.from}
                    sentAt={new Date(data.sentAt).toLocaleString()}
                    key={Math.random().toString(36)}
                  />
                ))}
            </div>
          </Row>
          <Row className="mr-2">
            <MessageInput />
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default ChatBox;
