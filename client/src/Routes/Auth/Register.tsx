import { userInfo } from 'os';
import React, { Dispatch } from 'react';
import {
  Button,
  Card,
  Container,
  Form,
  Navbar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { BsCheck, BsX } from 'react-icons/bs';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ScreenBox from '../../Components/ScreenBox';
import { IGlobalState } from '../../Interface/redux';
import { register } from '../../Store/Actions/auth';

interface IState {
  email: string;
  password: string;
  name: string;
  rememberMe: boolean;
}

const Register = () => {
  const [email, setEmail] = React.useState<IState['email']>('');
  const [password, setPassword] = React.useState<IState['password']>('');
  const [name, setName] = React.useState<IState['name']>('');
  const { userAccessToken, loading } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userAccessToken) {
      navigate('/');
    }
  }, [userAccessToken]);

  const registerHandler = () => {
    dispatch(register({ email, password, name }));
  };

  return (
    <ScreenBox>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">ChatApp</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Already have an account?{' '}
              <Button size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
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
              <Card.Title>Create Your Account</Card.Title>
            </Card.Header>
            <Card.Body className="p-3">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="default"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                  />
                  <Form.Text>We do not share your email with anyone.</Form.Text>
                </Form.Group>
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
                  <Form.Label>
                    <div className="flex flex-row">
                      <span>Password</span>
                      {password.length >= 8 && (
                        <BsCheck color="green" className="text-xl" />
                      )}
                    </div>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                </Form.Group>

                <Button variant="primary" onClick={registerHandler} size="sm">
                  <div className="d-flex align-items-center">
                    {loading && <Spinner animation="grow" size="sm" />}
                    <p className="mb-0">Register</p>
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

export default Register;
