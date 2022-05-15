import React from 'react';
import {
  Modal,
  Spinner,
  ListGroup,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { sendInvite } from '../../Store/Actions/friends';

import DefaultAvatar from '../DefaultAvatar';
import useData from './data';

interface IProps {
  isOpen: boolean;
  toggle: () => void;
}

const SearchUsers: React.FC<IProps> = ({ isOpen, toggle }) => {
  const dispatch: any = useDispatch();

  const { state, reduxState, onSearchChange } = useData();
  const { isSearching, userList } = state;
  const { userInfo } = reduxState;

  return (
    <Modal show={isOpen} onHide={toggle}>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <p className="mr-2 mb-0">Invite Users</p>
          {isSearching && (
            <Spinner animation="border" size="sm" variant="secondary" />
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search user..."
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={onSearchChange}
          />
        </InputGroup>
        <ListGroup>
          {userList.map((user) => (
            <ListGroup.Item
              key={user._id}
              className="d-flex justify-content-between"
            >
              <div className="d-flex align-items-center">
                <DefaultAvatar
                  color={user.avatarColor || ''}
                  text={`${user?.name || ''}`.slice(0, 1).toUpperCase()}
                />{' '}
                <p className="ml-2 mb-0">{user.name}</p>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  dispatch(sendInvite(user._id, userInfo?._id || ''))
                }
              >
                Invite
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default SearchUsers;
