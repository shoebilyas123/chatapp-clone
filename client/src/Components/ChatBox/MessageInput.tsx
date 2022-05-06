import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { AiOutlineSend } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { IGlobalState } from '../../Interface/redux';

const MessageInput = ({}) => {
  const [message, setMessage] = React.useState<string>('');
  const {
    userLogin: { userInfo },
    chatInfo,
  } = useSelector((state: IGlobalState) => state);

  const messageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  const onMessageSendHandler = () => {
    if (chatInfo?.socket) {
      chatInfo.socket.emit('messageFromClient', {
        from: userInfo?._id,
        to: chatInfo?._id,
        message,
      });
      setMessage('');
      const chats = document.getElementById(
        'chat-message-container-chat-app-by-shoeb-ilyas'
      );
      chats?.scrollTo(0, chats.scrollHeight);
    }
  };

  return (
    <div>
      <Form
        style={{ position: 'absolute', bottom: '0', width: '95%' }}
        className="d-flex align-items-center mb-3"
        onSubmit={(e: any) => {
          e.preventDefault();
          onMessageSendHandler();
        }}
      >
        <Form.Control
          placeholder="Type message..."
          aria-label="Username"
          aria-describedby="basic-addon1"
          onChange={messageChangeHandler}
          value={message}
        />
        <Button size="lg" className="m-2" onClick={onMessageSendHandler}>
          <AiOutlineSend />
        </Button>
      </Form>
    </div>
  );
};

export default MessageInput;