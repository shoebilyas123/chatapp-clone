import React from "react";
import { Button, Card } from "react-bootstrap";
import moment from "moment";

import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

interface IProps {
  chatHistory?: any;
}

const DUMMY_DATA = [
  {
    from: "ME",
    message: "Hello guys how are you",
    sentAt: Date.now() - 20000,
  },
  {
    from: "FRIEND",
    message: "Hi, I am fine. Just landed in Germany",
    sentAt: Date.now() - 10000,
  },
  {
    from: "ME",
    message: "Great to hear that.",
    sentAt: Date.now(),
  },
];

const ChatBox: React.FC<IProps> = () => {
  return (
    <Card className="m-2 ml-0" style={{ height: "90%" }}>
      <Card.Header>Sham 2</Card.Header>
      <Card.Body style={{ position: "relative" }}>
        {DUMMY_DATA.map((data) => (
          <ChatMessage
            message={data.message}
            from={data.from}
            sentAt={new Date(data.sentAt).toLocaleString()}
          />
        ))}
        <MessageInput />
      </Card.Body>
    </Card>
  );
};

export default ChatBox;
