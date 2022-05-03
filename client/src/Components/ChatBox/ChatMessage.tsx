import React from "react";

interface IProps {
  from: string;
  message: string;
  sentAt: string | Date;
}

const ChatMessage: React.FC<IProps> = ({ from, message }) => {
  return (
    <div
      className={`bg-${from === "ME" ? "info" : "primary"} p-2 my-2 text-white`}
      style={{
        border: "0px solid none",
        borderBottomLeftRadius: 15.5,
        borderBottomRightRadius: 15.5,
        borderTopRightRadius: from === "ME" ? "0px !important" : 15.5,
        borderTopLeftRadius: from === "ME" ? 15.5 : "0px !important",
        width: "50%",
        transform: from === "ME" ? "translateX(100%)" : "translateX()",
      }}
    >
      {message}
    </div>
  );
};

export default ChatMessage;
