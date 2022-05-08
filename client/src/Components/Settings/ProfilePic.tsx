import React from 'react';

import { CgProfile } from 'react-icons/cg';

interface IProps {
  content: string;
  color?: string;
  width?: string | number;
  height?: string | number;
}

const ProfilePic: React.FC<IProps> = ({ content, color, width, height }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-white rounded-circle"
      style={{
        width: width || '1.5rem',
        height: height || '1.5rem',
        backgroundColor: color || 'rgba(125, 125, 125, .4)',
      }}
    >
      <img src={content} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ProfilePic;
