import React from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { IGlobalState } from '../../Interface/redux';
import DefaultAvatar from '../DefaultAvatar';
import ProfilePic from './ProfilePic';
import { IoIosRemoveCircle } from 'react-icons/io';
import { MdModeEditOutline } from 'react-icons/md';

interface IProps {
  isOpen: boolean;
  toggle: () => void;
}

const Settings: React.FC<IProps> = ({ isOpen, toggle }) => {
  const { userInfo } = useSelector((state: IGlobalState) => state.userLogin);

  const [name, setName] = React.useState<string>(userInfo?.name || '');
  const [email, setEmail] = React.useState<string>(userInfo?.email || '');

  const [profilePic, setProfilePic] = React.useState<any>();
  const [selectPic, setSelectPic] = React.useState<boolean>();

  const toggleSelectPic = () => {
    setSelectPic((prev) => !prev);
  };

  const profileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e?.target?.files);
  };

  return (
    <>
      <Modal show={isOpen} onHide={toggle} backdrop="static" keyboard={false}>
        <ModalHeader closeButton>
          <Modal.Title>Profile Settings</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Container className="d-flex flex-column align-items-center justify-content-center">
            <Row className="d-flex flex-row align-items-center">
              <Col>
                {userInfo?.profilePic ? (
                  <ProfilePic content={userInfo?.profilePic} />
                ) : (
                  <DefaultAvatar
                    text={(userInfo?.name || '').slice(0, 1).toUpperCase()}
                  />
                )}
              </Col>
              <Col md={8}>
                <Button
                  style={{ width: '100%' }}
                  size="sm"
                  className="mb-2"
                  variant="danger"
                >
                  <div className="mb-0 d-flex align-items-center justify-content-center">
                    Remove <IoIosRemoveCircle color="white" className="ml-1" />
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
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
      <Modal show={profilePic} onHide={toggleSelectPic}>
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
      </Modal>
    </>
  );
};

export default Settings;
