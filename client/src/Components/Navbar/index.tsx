import React from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Button,
  Nav,
  Row,
  ListGroup,
} from "react-bootstrap";
import { FiSend } from "react-icons/fi";
import { BsPeopleFill } from "react-icons/bs";
import Logo from "../Logo";
import Popover from "../Popover";

const Navbar = () => {
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
                icon={<BsPeopleFill />}
              />
            </Nav.Item>
            <Nav.Item className="ml-2">
              <Popover
                title="Requests"
                width={"240px"}
                className="p-0"
                content={
                  <ListGroup>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0">Name 1</p>
                        <Button size="sm">Unsend</Button>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0">Name 1</p>
                        <Button size="sm">Unsend</Button>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0">Name 1</p>
                        <Button size="sm">Unsend</Button>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                }
                icon={<FiSend />}
              />
            </Nav.Item>
          </Nav>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
