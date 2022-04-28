import axios from "axios";
import React, { Dispatch } from "react";
import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "../../Components/DefaultAvatar";
import Navbar from "../../Components/Navbar";
import { IGlobalState } from "../../Interface/redux";
import { logout } from "../../Store/Actions/auth";
import { sendInvite } from "../../Store/Actions/friends";
import { getAuthConfig } from "../../Utilities/api";
import useData from "./data";

const Home = () => {
  const { state, onSearchChange, toggleAddUser, reduxState } = useData();
  const { isSearching, userList, addUserModal } = state;
  const { userInfo, userAccessToken } = reduxState;

  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();

  const [friendsList, setFriendsList] = React.useState<any>([]);

  React.useEffect(() => {
    if (!userAccessToken) {
      navigate("/login");
    }
  }, [userAccessToken]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Navbar />
      <Button onClick={logoutHandler}>Logout</Button>
      <div className="d-flex flex-row align-items-center">
        <div className="d-flex flex-column">
          <Button onClick={toggleAddUser}>+ Add User</Button>
        </div>
      </div>

      <Modal show={addUserModal} onHide={toggleAddUser}>
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
                    color={user.avatarColor || ""}
                    text={user.name.slice(0, 1).toUpperCase()}
                  />{" "}
                  <p className="ml-2 mb-0">{user.name}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    dispatch(sendInvite(user._id, userInfo?._id || ""))
                  }
                >
                  Invite
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
