import React from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { IGlobalState } from '../../Interface/redux';
import DefaultAvatar from '../DefaultAvatar';
import ProfilePic from './ProfilePic';
import { IoIosRemoveCircle } from 'react-icons/io';
import { MdModeEditOutline } from 'react-icons/md';
import axios from 'axios';
import { getAuthConfig } from '../../Utilities/api';
import {
  REMOVE_PROFILE_PIC,
  SET_PROFILE_PIC,
} from '../../Store/Constants/auth';
import { updateUserInfo } from '../../Store/Actions/auth';

interface IProps {
  isOpen: boolean;
  toggle: () => void;
}

const Settings: React.FC<IProps> = ({ isOpen, toggle }) => {
  const { userInfo, userAccessToken } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
  const dispatch: any = useDispatch();

  const [name, setName] = React.useState<string>(userInfo?.name || '');
  const [email, setEmail] = React.useState<string>(userInfo?.email || '');
  console.log({ ...userInfo });

  const [profilePic, setProfilePic] = React.useState<any>();
  const [selectPic, setSelectPic] = React.useState<boolean>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [removingProfile, setRemovingProfile] = React.useState<boolean>(false);
  const config = getAuthConfig({ token: userAccessToken });

  const toggleSelectPic = () => {
    setSelectPic((prev) => !prev);
  };

  const profileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setProfilePic(e.target.files ? e.target.files[0] : undefined);
  };

  const uploadProfileHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/v1/users/profile-pic/upload?fileName=${profilePic.name}&fileType=${profilePic.type}`,
        config
      );
      const configS3Client = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios.put(data.url, profilePic, configS3Client);
      const imageURL = data.url.split('?')[0];
      const response = await axios.post(
        '/api/v1/auth/profile-pic',
        {
          profilePic: imageURL,
        },
        config
      );

      dispatch({
        type: SET_PROFILE_PIC,
        payload: { profilePic: response.data },
      });
      setLoading(false);
      setSelectPic(false);
    } catch (err) {
      setLoading(false);
      setSelectPic(false);
      console.log(err);
    }
  };

  const removeProfileHandler = async () => {
    try {
      setRemovingProfile(true);
      await axios.put('/api/v1/auth/profile-pic/remove', {}, config);
      dispatch({ type: REMOVE_PROFILE_PIC });
      setRemovingProfile(false);
    } catch (error) {
      setRemovingProfile(false);
      console.log(error);
    }
  };
  return (
    <>
      <Modal show={isOpen} onHide={toggle} backdrop="static" keyboard={false}>
        <ModalHeader closeButton>
          <Modal.Title>Profile Settings</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Container className="d-flex flex-column align-items-center justify-content-center">
            <Row className="d-flex flex-row align-items-center justify-content-between">
              <Col md={4}>
                {userInfo?.profilePic ? (
                  <ProfilePic
                    content={userInfo?.profilePic}
                    width="5rem"
                    height="5rem"
                  />
                ) : (
                  <DefaultAvatar
                    width={'5rem'}
                    height={'5rem'}
                    fontSize={'2rem'}
                    text={(userInfo?.name || '').slice(0, 1).toUpperCase()}
                  />
                )}
              </Col>
              {/* <Col md={8}>
                <Button
                  style={{ width: '100%' }}
                  size="sm"
                  className="mb-2"
                  variant="danger"
                  onClick={removeProfileHandler}
                >
                  <div className="mb-0 d-flex align-items-center justify-content-center">
                    Remove{' '}
                    {removingProfile ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <IoIosRemoveCircle color="white" className="ml-1" />
                    )}
                  </div>
                </Button>
                <Button
                  style={{ width: '100%' }}
                  size="sm"
                  className="mb-2"
                  variant="outline-primary"
                  onClick={toggleSelectPic}
                >
                  <div className="mb-0 d-flex align-items-center justify-content-center">
                    Add New <MdModeEditOutline className="ml-1" />
                  </div>
                </Button>
              </Col> */}
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Form.Group className="mb-3" controlId="formBasicEmailSetting">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Change Your Email..."
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3" controlId="formBasicNameSetting">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="default"
                    placeholder="Change Your Name..."
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Row>
            <Col>
              <Button
                onClick={() => {
                  dispatch(updateUserInfo({ email, name }));
                }}
              >
                Update
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={toggle}>
                Close
              </Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
      <Modal show={selectPic} onHide={toggleSelectPic}>
        <Modal.Header>
          <Modal.Title>Upload Profile Pic</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-center">
          <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Label>Upload Pic</Form.Label>
            <Form.Control
              type="file"
              size="sm"
              onChange={profileSelectHandler}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={uploadProfileHandler} size="sm" variant="success">
            Continue {loading && <Spinner size="sm" animation="border" />}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Settings;
