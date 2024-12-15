import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import {jwtDecode} from 'jwt-decode';
import { API_ENDPOINT } from './Api';

import Swal from 'sweetalert2';

import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';


function Dashboard() {
  const [user, setUser] = useState([]);  // For storing decoded user info
  const navigate = useNavigate();
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State for showing update modal
  const [currentUser, setCurrentUser] = useState(null); // Store the user being updated
  const [newUsername, setNewUsername] = useState(''); // For the new username
  const [newFullname, setNewFullname] = useState(''); // For the new fullname
  const [newPassword, setNewPassword] = useState(''); // For the new password

  // Fetch and decode user ID when the component mounts
  useEffect(() => {
    const fetchDecodedUserId = async () => {
      try {
        const token = localStorage.getItem('token');

        // Decode the JWT token to get user details
        const decoded_token = jwtDecode(token);
        setUser(decoded_token);
        
      } catch (error) {
        navigate('/login');
      }
    };

    fetchDecodedUserId();
  }, []);

  // Handle logout
  const handleLogout = () => {
    try {
    localStorage.removeItem('token');
    navigate('/login');
  } catch (error) {
    console.error('Logout Failed', error)
   }
  };

  // Display Users
  const [users, setUsers] = useState([]);

      useEffect (()=> {
        fetchData();
      }, [])

      
      const fetchData = async () => {

        const userdata = localStorage.getItem('token');
        const token = userdata;
        const tokenDecoded = jwtDecode(token);
        setUsers(tokenDecoded);

        const headers = {
          accept: 'application/json',
          Authorization: token
        }

        const response = await axios.get(`${API_ENDPOINT}/user`, {headers: headers});
      setUsers(response.data);
      } 
       


  //Delete User
  const deleteUser = async (id) => {

    const token = localStorage.getItem('token');

    const headers = {
      accept: 'application/json',
      Authorization: token
    };

    const isConfirm = await Swal.fire({
      title: ' Are you sure?',
      text: "You won't able to return this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I want to delete it!'    
    }).then((result) => {
      return result.isConfirmed
    });

    if(!isConfirm){
      return;
    }

    try {
      const response = await axios.delete(`${API_ENDPOINT}/user/${id}`, { headers });
  
      Swal.fire({
          icon: "success",
          text: "Successfully Deleted"
      });
      fetchData();
  } catch (error) {
      if (error.response) {
          console.log("Delete Response:", response);
      }      
  }
}

 


/* CREATE USER */
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const [fullname, setFullname] = useState("");
const [username, setUsername] = useState("");
const [passwordx, setPassword] = useState("");
const [validationError, setValidationError] = useState({});

const createUser = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const headers = {
      accept: 'application/json',
      Authorization: token
    };

    const formData = new FormData();

    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("password", passwordx);

    await axios.post(`${API_ENDPOINT}/user`, {fullname, username, passwordx}, { headers: headers }).then(({ data }) => {
        Swal.fire({
            icon: "success",
            text: "Successfully Created!"
        });
        handleClose();
        fetchData();
    }).catch((error) => {
      if (error.response) {
        console.log("Delete Response:", response); 
        }
    });
};

/* READ USER */
const [selectedUser, setSelectedUser] = useState(null);
const [show1, setShow1] = useState(false);

const handleClose1 = () => setShow1(false);

const handleShow1 = (row_users) => {
    setSelectedUser(row_users);
    setShow1(true);
};



//Update Users
const handleEdit = (users) => {
  setCurrentUser(users);
  setNewFullname(users.fullname);
  setNewUsername(users.username);
  setNewPassword(users.passwordx);
  setShowUpdateModal(true); // Open the update modal
};

const updateUsers = async (e) => {
  e.preventDefault();

  if (!newUsername || !newFullname || !newPassword) {
    Swal.fire({
      text: 'Username, Password, and Fullname are required!',
      icon: 'error',
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const headers = {
      accept: 'application/json',
      Authorization: token,
    };

    // Prepare the updated data
    const updatedUser = {
      username: newUsername,
      fullname: newFullname,
      passwordx: newPassword
    };

    // Send the update request
    const response = await axios.put(`${API_ENDPOINT}/user/${currentUser.id}`, updatedUser, { headers });

    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        text: 'User updated successfully!',
      });

      // Fetch the updated list of users
      fetchData();
      setShowUpdateModal(false); // Close the modal after update
    }
  } catch (error) {
    console.error('Error updating user:', error);
    Swal.fire({
      text: 'An error occurred while updating user data.',
      icon: 'error',
    });
  }
};

const handleCloseModal = () => {
  setShowUpdateModal(false); // Close modal if the user cancels
};


  // Render the user table
  return (
    <>
      <Navbar style={{
          background: 'linear-gradient(to right, #CE203C, #272822 )',
          padding: '1rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        variant="dark">
        <Container>
          <Navbar.Brand href="#home">PNHS Student Portal</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#users">Students</Nav.Link>
            <Nav.Link href="#departments">Departments</Nav.Link>
            <Nav.Link href="#courses">Courses</Nav.Link>
          </Nav>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title={user ? `User: ${user.username}` : 'Dropdown'} id="basic-nav-dropdown" align="end" style={{fontWeight: 'bold'}}>
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <br />

      <div className="container">
        <div className="col-12">
          <Button variant="btn btn-success mb-2 float-end btn-sm me-2" onClick={handleShow} style={{
          background:  '#99201C',
          padding: '1rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}>
            Add Student
          </Button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ padding: 1, margin: 0 }}><center>ID</center></th>
              <th style={{ padding: 1, margin: 0 }}><center>Username</center></th>
              <th style={{ padding: 1, margin: 0 }}><center>Password</center></th>
              <th style={{ padding: 1, margin: 0, width: '260px' }}>
                <center>Action</center>
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 &&
              users.map((row_users) => (
                <tr key={row_users.id}>
                  <td style={{ padding: 1, margin: 0 }}>{row_users.id}</td>
                  <td style={{ padding: 1, margin: 0 }}>{row_users.username}</td>
                  <td style={{ padding: 1, margin: 0 }}>{row_users.fullname}</td>
                  <td style={{ padding: 1, margin: 0 }}>
                    <center>
                      <Button variant="secondary" size="sm" onClick={() => handleShow1(row_users)} style={{marginRight: '6px'}}>
                        Read
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteUser (row_users.id)}  style={{marginRight: '6px'}}>
                        Delete
                      </Button>
                      <Button variant="success" size="sm" onClick={() => handleEdit(row_users)}>
                        Update
                      </Button>
                    </center>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      <div innert="true">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={createUser}>
            <Row>
              <Col>
              <Form.Group controlId="Name">
                <Form.Label>Fullname</Form.Label>
                <Form.Control type="text" value={fullname} onChange={(event) => {setFullname(event.target.value)}} required></Form.Control>
              </Form.Group>
              </Col>
            </Row>



            <Row>
              <Col>
              <Form.Group controlId="Username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={username} onChange={(event) => {setUsername(event.target.value)}} required></Form.Control>
              </Form.Group>
              </Col>
            </Row>


            <Row>
              <Col>
              <Form.Group controlId="Name">
                <Form.Label>Password</Form.Label>
                <Form.Control type="text" value={passwordx} onChange={(event) => {setPassword(event.target.value)}} required></Form.Control>
              </Form.Group>
              </Col>
            </Row>
         

          <Button variant="primary" className="mt-2" size="sm" block="block" type="submit">Save</Button>
         
         </Form>
        </Modal.Body>
      </Modal>
      </div>

      {/* User Details Modal */}
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Row Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedUser ? (
            <div>
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Fullname:</strong> {selectedUser.fullname}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
            </div>
          ) : (
            <p>No Data Available</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        {/* Update User Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateUsers}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFullname">
              <Form.Label>FullName</Form.Label>
              <Form.Control
                type="text"
                value={newFullname}
                onChange={(e) => setNewFullname(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFullname">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      </div>
    </>
  );
}

export default Dashboard;
