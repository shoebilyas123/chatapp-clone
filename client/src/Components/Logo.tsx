import React from "react";

const Logo = () => {
  return (
    <div
      className="bg-white p-2 text-primary"
      style={{
        border: "2px solid white",
        borderTopRightRadius: 7.5,
        borderBottomLeftRadius: 7.5,
        borderBottomRightRadius: 7.5,
        borderTopLeftRadius: "0px !important",
      }}
    >
      ChatApp-Clone
    </div>
  );
};

export default Logo;
