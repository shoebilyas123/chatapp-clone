import { userInfo } from 'os';
import React, { Dispatch } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Navbar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ScreenBox from '../../Components/ScreenBox';
import { IGlobalState } from '../../Interface/redux';
import { login } from '../../Store/Actions/auth';

interface IState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [email, setEmail] = React.useState<IState['email']>('');
  const [password, setPassword] = React.useState<IState['password']>('');
  const { userAccessToken, userInfo, loading } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userAccessToken || userInfo) {
      navigate('/');
    }
  }, [userAccessToken, userInfo]);

  const loginHandler = () => {
    dispatch(login({ email, password }));
  };

  return (
    <ScreenBox>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">ChatApp</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              No account? <Button size="sm">Sign Up</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container
        style={{ height: '90vh' }}
        className="d-flex flex-row align-items-center justify-content-center"
      >
        <Row md={12}>
          <Card className="p-0">
            <Card.Header>
              <Card.Title>Login To Your Account</Card.Title>
            </Card.Header>
            <Card.Body className="p-3">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                  <Form.Text>We do not share your email with anyone.</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                </Form.Group>

                <Button variant="primary" onClick={loginHandler} size="sm">
                  <div className="d-flex align-items-center">
                    {loading && <Spinner animation="grow" size="sm" />}
                    <p className="mb-0">Continue</p>
                  </div>
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </ScreenBox>
  );
};

export default Login;
