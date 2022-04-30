import React, { Dispatch, useEffect } from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Button,
  Nav,
  Row,
  ListGroup,
  Spinner,
  Card,
} from "react-bootstrap";
import { FiRefreshCcw, FiSend } from "react-icons/fi";
import { BsPeopleFill, BsPlusCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import Popover from "../Popover";
import Logo from "../Logo";
import { IAuthData, IGlobalState, IFRRequests } from "../../Interface/redux";
import DefaultAvatar from "../DefaultAvatar";
import SearchUsers from "../SearchUsers";
import { acceptInvite } from "../../Store/Actions/friends";
import { getMyInfo } from "../../Store/Actions/auth";

const Navbar = () => {
  const { userAccessToken, userInfo, loading } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
  const dispatch: Dispatch<any> = useDispatch();
  const [isSearchModal, setIsSearchModal] = React.useState<boolean>(false);
  const toggleAddUserModal = () => {
    setIsSearchModal((prev) => !prev);
  };

  const acceptInviteHandler = (id: string) => {
    dispatch(acceptInvite(id));
  };

  return (
    <BootstrapNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <div className="w-100 d-flex flex-row align-items-center justify-content-between">
          <BootstrapNavbar.Brand>
            <Logo />
          </BootstrapNavbar.Brand>
          <Nav>
            <Nav.Item className="mr-3 mb-0 mt-2">
              <div className="d-flex flex-row align-items-center">
                <div className="d-flex flex-column">
                  <div
                    onClick={toggleAddUserModal}
                    style={{ cursor: "pointer" }}
                    className="mb-0 ml-2"
                  >
                    <BsPlusCircle color="white" />
                  </div>
                </div>
              </div>
            </Nav.Item>
            <Nav.Item>
              <Popover
                title="Requests"
                width={"240px"}
                className="p-0"
                placement="bottom"
                content={
                  <>
                    {userInfo?.pendingRequests &&
                    userInfo?.pendingRequests?.length > 0 ? (
                      <ListGroup>
                        {userInfo?.pendingRequests.map(
                          (pending: IFRRequests) => (
                            <ListGroup.Item>
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="mb-0">{pending.name}</p>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    acceptInviteHandler(pending._id)
                                  }
                                >
                                  Accept
                                </Button>
                              </div>
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    ) : (
                      <Container style={{ width: "100%", height: "150px" }}>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: "100%" }}
                        >
                          <p>No Pending Requests</p>
                        </div>
                      </Container>
                    )}
                  </>
                }
                icon={<BsPeopleFill color="white" />}
              />
            </Nav.Item>
            <Nav.Item className="ml-2">
              <Popover
                title={
                  <div className="d-flex align-items-center justify-content-between">
                    Sent
                  </div>
                }
                width={"240px"}
                className="p-0"
                content={
                  <div>
                    {(userInfo?.sentRequests || []).length > 0 ? (
                      <ListGroup>
                        {userInfo?.sentRequests.map((request: IFRRequests) => (
                          <ListGroup.Item>
                            <div className="d-flex align-items-center justify-content-between">
                              <DefaultAvatar
                                color={request?.avatarColor || ""}
                                text={request?.name?.slice(0, 1).toUpperCase()}
                              />
                              <p className="mb-0">{request.name}</p>
                              <Button size="sm">Unsend</Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <Container style={{ width: "100%", height: "150px" }}>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: "100%" }}
                        >
                          <p>No Pending Requests</p>
                        </div>
                      </Container>
                    )}
                    {!userInfo?.sentRequests && loading && (
                      <Spinner animation="border" size="sm" />
                    )}
                  </div>
                }
                icon={<FiSend color="white" />}
              />
            </Nav.Item>
            <Nav.Item>
              <Button variant="primary" size="sm" className="mb-0">
                <FiRefreshCcw onClick={() => dispatch(getMyInfo())} />
              </Button>
            </Nav.Item>
          </Nav>
        </div>
        <SearchUsers isOpen={isSearchModal} toggle={toggleAddUserModal} />
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
