import axios from 'axios';
import React, { Dispatch } from 'react';
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DefaultAvatar from '../../Components/DefaultAvatar';
import Navbar from '../../Components/Navbar';
import ScreenBox from '../../Components/ScreenBox';
import { IGlobalState } from '../../Interface/redux';
import { logout } from '../../Store/Actions/auth';
import { sendInvite } from '../../Store/Actions/friends';
import { getAuthConfig } from '../../Utilities/api';
import Contacts from '../../Components/Contacts';
import useData from './data';
import ChatBox from '../../Components/ChatBox';

const Home = () => {
  const { state, toggleAddUser, reduxState } = useData();
  const { addUserModal } = state;
  const { userInfo, userAccessToken, chatInfo, loading } = reduxState;
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userAccessToken) {
      navigate('/login');
    }
  }, [userAccessToken]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Navbar />
      <ScreenBox>
        <Container style={{ backgroundColor: '#EBEBEB' }}>
          <Row md={12}>
            <Col md={4} style={{ height: '100vh', overflowY: 'auto' }}>
              <Contacts contacts={userInfo?.friends || []} />
            </Col>
            {chatInfo && chatInfo._id && (
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
