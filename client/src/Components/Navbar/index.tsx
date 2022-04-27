import React from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Button,
  Nav,
  Row,
  ListGroup,
} from "react-bootstrap";
import { FiRefreshCcw, FiSend } from "react-icons/fi";
import { BsPeopleFill } from "react-icons/bs";
import Logo from "../Logo";
import Popover from "../Popover";
import { useSelector } from "react-redux";
import { IGlobalState } from "../../Interface/redux";
import axios from "axios";
import DefaultAvatar from "../DefaultAvatar";

const Navbar = () => {
  const { userInfo } = useSelector((state: IGlobalState) => state.userLogin);
  const [sentRequests, setSentRequests] = React.useState<any>([]);
  const [requests, setRequests] = React.useState<any>([]);

  const getFriendsInfo = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      const { data } = await axios.get("/api/v1/users/friends", config);

      setSentRequests(data.sentRequests);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (sentRequests === 0 || requests.length === 0) {
      getFriendsInfo();
    }
  }, []);
  return (
    <BootstrapNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <div className="w-100 d-flex flex-row align-items-center justify-content-between">
          <BootstrapNavbar.Brand>
            <Logo />
          </BootstrapNavbar.Brand>
          <Nav>
            <Nav.Item>
              <Popover
                title="Requests"
                width={"240px"}
                className="p-0"
                content={
                  <ListGroup>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0">Name 1</p>
                        <Button size="sm">Accept</Button>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0">Name 1</p>
                        <Button size="sm">Accept</Button>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0">Name 1</p>
                        <Button size="sm">Accept</Button>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                }
                icon={<BsPeopleFill color="white" />}
              />
            </Nav.Item>
            <Nav.Item className="ml-2">
              <Popover
                title={
                  <div className="d-flex align-items-center justify-content-between">
                    Sent
                    <Button variant="secondary" size="sm">
                      <FiRefreshCcw onClick={getFriendsInfo} />
                    </Button>
                  </div>
                }
                width={"240px"}
                className="p-0"
                content={
                  <ListGroup>
                    {sentRequests.length > 0 &&
                      sentRequests.map(
                        (request: {
                          name: string;
                          profilePic: string;
                          avatarColor: string;
                          _id: string;
                        }) => (
                          <ListGroup.Item>
                            <div className="d-flex align-items-center justify-content-between">
                              <DefaultAvatar
                                color={request.avatarColor || ""}
                                text={request?.name?.slice(0, 1).toUpperCase()}
                              />
                              <p className="mb-0">{request.name}</p>
                              <Button size="sm">Unsend</Button>
                            </div>
                          </ListGroup.Item>
                        )
                      )}
                  </ListGroup>
                }
                icon={<FiSend color="white" />}
              />
            </Nav.Item>
          </Nav>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
