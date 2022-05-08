import React, { Dispatch } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import ScreenBox from '../../Components/ScreenBox';
import { logout } from '../../Store/Actions/auth';
import { updateChatHistory } from '../../Store/Actions/friends';
import Contacts from '../../Components/Contacts';
import useData from './data';
import ChatBox from '../../Components/ChatBox';
import ScreenLoader from '../../Components/ScreenLoader';

const Home = () => {
  const { state, toggleAddUser, reduxState } = useData();
  const { userInfo, userAccessToken, chatsLoading, chatInfo, loading } =
    reduxState;
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userAccessToken) {
      navigate('/login');
    }
  }, [userAccessToken]);

  React.useEffect(() => {
    if (chatInfo?.socket) {
      chatInfo?.socket.on('messageFromServer', (data: any) => {
        const transformedMsg = {
          ...data,
          from: data.socketId === chatInfo?.socket.id ? 'ME' : 'FRIEND',
        };
        dispatch(updateChatHistory(transformedMsg));
        chatInfo.socket.off('messageFromServer');
      });
    }
  }, [chatInfo]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div style={{ width: '100vw !important' }}>
      <Navbar />
      {(chatsLoading || loading) && <ScreenLoader />}
      <ScreenBox>
        <Container>
          <Row md={12}>
            <Col md={4} style={{ height: '100vh', overflowY: 'auto' }}>
              {userInfo?.friends && (
                <Contacts contacts={userInfo?.friends || []} />
              )}
            </Col>
            {chatInfo?._id && (
              <Col md={8}>
                <ChatBox />
              </Col>
            )}
          </Row>
        </Container>
      </ScreenBox>
    </div>
  );
};

export default Home;
