import axios from "axios";
import React, { Dispatch } from "react";
import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "../../Components/DefaultAvatar";
import Navbar from "../../Components/Navbar";
import { IGlobalState } from "../../Interface/redux";
import { logout } from "../../Store/Actions/auth";

interface IUserList {
  name: string;
  email: string;
  avatarColor: string;
  _id: string;
}

const Home = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const { userInfo } = useSelector((state: IGlobalState) => state.userLogin);
  const navigate = useNavigate();

  const [addUserModal, setAddUserModal] = React.useState(false);
  const [userList, setUserList] = React.useState<IUserList[]>([]);
  const [friendsList, setFriendsList] = React.useState<any>([]);

  React.useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo]);

  const toggleAddUser = () => {
    setAddUserModal((prev) => !prev);
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const search = e.target.value;

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      const { data } = await axios.get(
        `/api/v1/users?search=${search}&forFR=true`,
        config
      );

      setUserList(
        data.map((user: any) => ({
          name: user.name,
          email: user.email,
          _id: user._id,
          avatarColor: user.avatarColor,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const inviteUserHandler = async (id: string) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      const { data } = await axios.post(
        `/api/v1/users/invite`,
        {
          to: id,
          from: userInfo.id,
        },
        config
      );

      console.log({ S: data.success });
    } catch (error) {
      console.log(error);
    }
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
          <Modal.Title>Search Users</Modal.Title>
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
                <Button size="sm" onClick={() => inviteUserHandler(user._id)}>
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
