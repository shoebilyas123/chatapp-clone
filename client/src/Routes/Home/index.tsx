import axios from 'axios';
import React, { Dispatch } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import ScreenBox from '../../Components/ScreenBox';
import { getMyInfo } from '../../Store/Actions/auth';
import { updateChatHistory } from '../../Store/Actions/friends';
import Contacts from '../../Components/Contacts';
import useData from './data';
import ChatBox from '../../Components/ChatBox';
import ScreenLoader from '../../Components/ScreenLoader';
import { showOnline } from '../../Store/Actions/chats';

const Home = () => {
  const { state, reduxState } = useData();
  const { userInfo, userAccessToken, chats, loading } = reduxState;
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userAccessToken) {
      navigate('/login');
    } else {
      dispatch(getMyInfo());
    }
  }, [userAccessToken]);

  React.useEffect(() => {
    if (chats?.socket) {
      chats?.socket.on('showOnline', () => {
        dispatch(showOnline());
        chats.socket.off('showOnline');
      });
      chats?.socket.on('messageFromServer', (data: any) => {
        const transformedMsg = {
          ...data,
          from: data.socketId === chats?.socket.id ? 'ME' : 'FRIEND',
        };
        dispatch(updateChatHistory(transformedMsg));
        chats.socket.off('messageFromServer');
      });
    }
  }, [chats]);

  return (
    <div style={{ width: '100vw !important' }}>
      <Navbar />
      {loading && <ScreenLoader />}
      <ScreenBox>
        <Container>
          <Row md={12}>
            <Col md={4} style={{ height: '100vh', overflowY: 'auto' }}>
              {userInfo && userInfo?.friends && (
                <Contacts contacts={userInfo?.friends || []} />
              )}
            </Col>
            {chats?._id && (
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
