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
import { API_ENDPOINT } from './Api';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import {jwtDecode} from 'jwt-decode';

function Dashboard() {
  const [user, setUser] = useState([]);  // For storing decoded user info
  const navigate = useNavigate();

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


  useEffect(() => {
    const fetchData = async () => {
      try{


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
       } catch (error) {
        console.error('Cannot fetch data', error)
      }
    }
    fetchData();
  }, [])

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
    
      console.log('Delete Response:', response); // Debug API response
    
      Swal.fire({
        icon: 'success',
        text: 'Successfully Deleted',
      });
    
      fetchData(); // Refetch users list
    } catch (error) {
      console.error('Error Response:', error.response); // Log detailed error
      let errorMessage = 'An unexpected error occurred';
    
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
    
      Swal.fire({
        text: errorMessage,
        icon: 'error',
      });
    }
    
    
  };

 


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
            text: data.message
        });
        fetchData();
    }).catch((error) => {
      if (error.response) {
          // The request was made, but the server responded with an error
          if (error.response.status === 422) {
              setValidationError(error.response.data.errors);
          } else {
              Swal.fire({
                  text: error.response.data.message || "An error occurred",
                  icon: "error"
              });
          }
      } else if (error.request) {
          // The request was made, but no response was received
          Swal.fire({
              text: "No response from server. Please try again later.",
              icon: "error"
          });
      } else {
          // Something happened while setting up the request
          Swal.fire({
              text: `Error: ${error.message}`,
              icon: "error"
            });
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

// console.log(row_users);



  // Render the user table
  return (
    <>
      <Navbar style = {{background: 'linear-gradient(blue, #e096d7 0%, #2575fc 100%)',
          padding: '1rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        variant="dark">
        <Container>
          <Navbar.Brand href="#home">My College Portal</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#users">Students</Nav.Link>
            <Nav.Link href="#departments">Departments</Nav.Link>
            <Nav.Link href="#courses">Courses</Nav.Link>
          </Nav>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title={user ? `User: ${user.username}` : 'Dropdown'} id="basic-nav-dropdown" align="end">
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
          background: 'linear-gradient(blue, #e096d7 0%, #2575fc 100%)',
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
              <th style={{ padding: 1, margin: 0 }}>
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
                      <Button variant="secondary" size="sm" onClick={() => handleShow1(row_users)}>
                        Read
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteUser (row_users.id)}>
                        Delete
                      </Button>
                      <Button variant="success" size="sm">
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
    </>
  );
}

export default Dashboard;
