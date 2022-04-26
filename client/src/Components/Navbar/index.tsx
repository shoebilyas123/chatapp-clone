import React from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
  ListGroup,
  Button,
  Row,
  Dropdown,
} from "react-bootstrap";
import { FiSend } from "react-icons/fi";

const Navbar = () => {
  return (
    <BootstrapNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <BootstrapNavbar.Brand href="#home">
          React-Bootstrap
        </BootstrapNavbar.Brand>

        <Nav className="me-auto">
          <Dropdown title="Dropdown" id="collasible-nav-dropdown">
            <Dropdown.Toggle id="dropdown-custom-components">
              <FiSend />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "250px", margin: 0 }}>
              <ListGroup style={{ margin: 0 }}>
                <ListGroup.Item
                  //   style={{ border: "none" }}
                  className="d-flex align-items-center justify-content-between "
                >
                  Name{" "}
                  <Button size="sm" className="ml-2">
                    Unsend
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item
                  //   style={{ border: "none" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  Something{" "}
                  <Button size="sm" className="ml-2">
                    Unsend
                  </Button>
                </ListGroup.Item>{" "}
                <ListGroup.Item
                  //   style={{ border: "none" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  Something{" "}
                  <Button size="sm" className="ml-2">
                    Unsend
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
