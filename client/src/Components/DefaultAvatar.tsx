import React from 'react';

import { CgProfile } from 'react-icons/cg';

interface IProps {
  text: string;
  color?: string;
  width?: string | number;
  height?: string | number;
}

const DefaultAvatar: React.FC<IProps> = ({ text, color, width, height }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-white rounded-circle"
      style={{
        width: width || '1.5rem',
        height: height || '1.5rem',
        backgroundColor: color || 'rgba(125, 125, 125, .4)',
      }}
    >
      {text}
    </div>
  );
};

export default DefaultAvatar;
