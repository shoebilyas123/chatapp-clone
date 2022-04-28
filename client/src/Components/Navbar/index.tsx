import React, { useEffect } from "react";
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
import { BsPeopleFill } from "react-icons/bs";
import Logo from "../Logo";
import Popover from "../Popover";
import { useSelector } from "react-redux";
import { IAuthData, IGlobalState, IFRRequests } from "../../Interface/redux";
import DefaultAvatar from "../DefaultAvatar";

const Navbar = () => {
  const { userAccessToken, userInfo, loading } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
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
                placement="bottom"
                content={
                  <>
                    {userInfo?.pendingRequests.length > 0 ? (
                      <ListGroup>
                        {userInfo?.pendingRequests.map(
                          (pending: IFRRequests) => (
                            <ListGroup.Item>
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="mb-0">{pending.name}</p>
                                <Button size="sm">Accept</Button>
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
                                color={request.avatarColor || ""}
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
          </Nav>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
