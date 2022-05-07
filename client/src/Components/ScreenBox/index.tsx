import React, { ReactNode } from 'react';

interface IProps {
  className?: string;
  children: ReactNode;
}

const ScreenBox: React.FC<IProps> = ({ children, className }) => {
  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'none' }}
      className={className || ''}
    >
      {children}
    </div>
  );
};

export default ScreenBox;
