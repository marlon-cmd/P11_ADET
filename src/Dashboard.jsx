import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { jwtDecode } from 'jwt-decode';


import { API_ENDPOINT } from './Api';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // If no token, redirect to login page
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedUser = jwtDecode(token);  // Decode token to get user data
      setUser(decodedUser);  // Set the user object

      // Check if the token is expired
      if (decodedUser.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');  // Token expired, remove and redirect to login
        navigate('/login');
      }
    } catch (error) {
      // If the token is invalid, remove from localStorage and navigate to login
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login if no token
      return;
    }

    try {
      const response = await axios.get(`${API_ENDPOINT}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the dashboard data
      console.log(response.data);
    } catch (error) {
      // Handle any errors from the API request
      console.error('Request failed:', error);
      if (error.response && error.response.status === 401) {
        // If unauthorized, remove the token and redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">My College Portal</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown
            title={`Welcome, ${user.username || 'User'}`}  // Default to 'User' if username is not available
            id="basic-nav-dropdown"
            align="end"
          >
            <NavDropdown.Item onClick={fetchDashboardData}>
              Dashboard Data
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Dashboard;
