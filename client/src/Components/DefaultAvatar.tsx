import React from "react";

interface IProps {
  text: string;
  color?: string;
}

const DefaultAvatar: React.FC<IProps> = ({ text, color }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-white rounded-circle"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        backgroundColor: color || "rgba(125, 125, 125, .4)",
      }}
    >
      {text}
    </div>
  );
};

export default DefaultAvatar;
