import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

import { API_ENDPOINT } from './Api';

import Register from './Register';

const Login = () => {
  const [username, setUsername] = useState('');
  const [passwordx, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To show loading spinner
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        // Check if the token is expired
        if (user.exp * 1000 > Date.now()) {
          navigate('/dashboard');  // Redirect if token is valid
        } else {
          localStorage.removeItem('token'); // Remove expired token
        }
      } catch (error) {
        localStorage.removeItem('token');  // Remove invalid token
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error
    setIsLoading(true); // Show loading spinner

    try {
      const response = await axios.post(`${API_ENDPOINT}/api/auth/login`, {
        username,
        passwordx,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token); // Save token
        navigate('/dashboard');  // Redirect to dashboard
      }
    } catch (error) {
      // Handle errors more effectively
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Invalid username or password');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      } else {
        // Network error or timeout
        setErrorMessage('Network error. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2>Login</h2>
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

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="passwordx"
              placeholder="Enter password"
              value={passwordx}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
            {isLoading ? (
              <Spinner animation="border" size="sm" /> // Show spinner when loading
            ) : (
              'Login'
            )}
          </Button>
        </Form>

        <div className="mt-3">
          <p>Don't have an account?</p>
          <Button variant="link" onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>

      </Col>
    </Row>
  );
};

export default Login;
