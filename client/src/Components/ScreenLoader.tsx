import React from 'react';
import ReactDOM from 'react-dom';
import { Spinner } from 'react-bootstrap';

interface IProps {}
const Content: React.FC<IProps> = ({}) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,.25)',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
      className="d-flex align-items-center justify-content-center"
    >
      <Spinner animation="border" />
    </div>
  );
};

const ScreenLoader = () => {
  const portalDiv = document.getElementById('portal-shoeb-ilyas-chat-app');
  return portalDiv ? (
    <>{ReactDOM.createPortal(<Content />, portalDiv)}</>
  ) : null;
};

export default ScreenLoader;
