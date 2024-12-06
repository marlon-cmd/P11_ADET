import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Spinner, Navbar, Container } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

import { API_ENDPOINT } from './Api';


const Login = () => {
  const [username, setUsername] = useState('');
  const [passwordx, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        if (user.exp * 1000 > Date.now()) {
          navigate('/dashboard');
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_ENDPOINT}/api/auth/login`, {
        username,
        passwordx,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar
        style={{
          background: 'linear-gradient(blue, #e096d7 0%, #2575fc 100%)',
          padding: '1rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        variant="dark"
      >
        <Container>
          <Navbar.Brand style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', fontSize: '1.5rem', color: '#fff' }}>
            My College Portal
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <Row className="justify-content-md-center" style={{ marginTop: '10vh' }}>
          <Col md={4}>
            <div
              className="card"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: '12px', background: '#ffffff', padding: '20px' }}
            >
              <h4 className="text-center" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: '700', color: '#333' }}>
                Login
              </h4>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={passwordx}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      variant="primary"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Login'}
                </Button>
              </Form>

              <div className="mt-3">
                <p>Don't have an account?</p>
                <Button variant="link" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
