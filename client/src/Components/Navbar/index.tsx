import React, { Dispatch, Ref } from 'react';
import {
  Navbar as BootstrapNavbar,
  Container,
  Button,
  Nav,
  ListGroup,
  Spinner,
  Dropdown,
} from 'react-bootstrap';
import { FiRefreshCcw, FiSend } from 'react-icons/fi';
import { BsPeopleFill, BsPlusCircle } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';

import Popover from '../Popover';
import Logo from '../Logo';
import { IGlobalState, IFriends } from '../../Interface/redux';
import DefaultAvatar from '../DefaultAvatar';
import SearchUsers from '../SearchUsers';
import { acceptInvite } from '../../Store/Actions/friends';
import { getMyInfo, logout } from '../../Store/Actions/auth';
import Settings from '../Settings';
import ProfilePic from '../Settings/ProfilePic';

const CustomToggle: any = React.forwardRef(
  (
    {
      children,
      onClick,
    }: { children: React.ReactNode; onClick: (e: any) => void },
    ref: Ref<any>
  ) => (
    <a
      href=""
      ref={ref}
      onClick={(e: any) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  )
);

const Navbar = () => {
  const { userAccessToken, userInfo, loading } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
  const dispatch: Dispatch<any> = useDispatch();
  const [isSearchModal, setIsSearchModal] = React.useState<boolean>(false);
  const [settingsModal, setSettingsModal] = React.useState<boolean>(false);
  const toggleAddUserModal = () => {
    setIsSearchModal((prev) => !prev);
  };

  const acceptInviteHandler = (id: string) => {
    dispatch(acceptInvite(id));
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  const toggleSettingsModal = () => {
    setSettingsModal((prev) => !prev);
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
                    style={{ cursor: 'pointer' }}
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
                width={'240px'}
                className="p-0"
                placement="bottom"
                content={
                  <>
                    {userInfo?.pendingRequests &&
                    userInfo?.pendingRequests?.length > 0 ? (
                      <ListGroup>
                        {userInfo?.pendingRequests.map((pending: IFriends) => (
                          <ListGroup.Item>
                            <div className="d-flex align-items-center justify-content-between">
                              <p className="mb-0">{pending.name}</p>
                              <Button
                                size="sm"
                                onClick={() => acceptInviteHandler(pending._id)}
                              >
                                Accept
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <Container style={{ width: '100%', height: '150px' }}>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: '100%' }}
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
                width={'240px'}
                className="p-0"
                content={
                  <div>
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : userInfo?.sentRequests ? (
                      <ListGroup>
                        {userInfo?.sentRequests.map((request: IFriends) => (
                          <ListGroup.Item>
                            <div className="d-flex align-items-center justify-content-between">
                              {request?.profilePic ? (
                                <ProfilePic content={request.profilePic} />
                              ) : (
                                <DefaultAvatar
                                  text={request.name.slice(0, 1).toUpperCase()}
                                  color={request.avatarColor || ''}
                                  width={'3rem'}
                                  height="3rem"
                                />
                              )}
                              <p className="mb-0">{request.name}</p>
                              <Button size="sm">Unsend</Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <Container style={{ width: '100%', height: '150px' }}>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: '100%' }}
                        >
                          <p>No Pending Requests</p>
                        </div>
                      </Container>
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
            <Dropdown className="d-inline mx-2">
              <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-autoclose-true"
                className="pt-2"
              >
                <CgProfile color="white" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Delete Chats</Dropdown.Item>
                <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={toggleSettingsModal}>
                  Settings
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
        <SearchUsers isOpen={isSearchModal} toggle={toggleAddUserModal} />
      </Container>
      <Settings isOpen={settingsModal} toggle={toggleSettingsModal} />
    </BootstrapNavbar>
  );
};

export default Navbar;
