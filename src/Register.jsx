import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';

import { API_ENDPOINT } from './Api'; // Import your API endpoint

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [passwordx, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (passwordx !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_ENDPOINT}/api/auth/register`, {
        fullname,
        username,
        passwordx,
      });

      if (response.status === 201) { // Assuming 201 for successful registration
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/'); // Redirect to login after success
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'An error occurred during registration');
      } else {
        setErrorMessage('Network error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2>Register</h2>

        {errorMessage && (
          <Alert variant="danger">{errorMessage}</Alert>
        )}

        {successMessage && (
          <Alert variant="success">{successMessage}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFullname">
            <Form.Label>Fullname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formUsername" className="mt-3">
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
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={passwordx}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formConfirmPassword" className="mt-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Register'}
          </Button>
        </Form>

        <div className="mt-3">
          <p>Already have an account?</p>
          <Button variant="link" onClick={() => navigate('/')}>
            Login
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
