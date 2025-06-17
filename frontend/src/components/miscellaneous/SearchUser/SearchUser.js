import Offcanvas from "react-bootstrap/Offcanvas";
import { useEffect, useState } from "react";
import axios from "axios";
import {Form,Button} from "react-bootstrap";

const SearchUser = ({ show, handleClose }) => {
  const [users, setUsers] = useState([]);
  const[addUser, setAddUser]=useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = loggedUser.token;
        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Could not load users.");
      }
    };

    if (show) fetchUsers();
  });

  const filteredUsers = users.filter((user) =>
    user.Username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlesubmit = async (userId) => {
  try {
    const token = loggedUser.token;
    const response = await axios.post(
      "/api/chat",
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAddUser(response.data);
  } catch (err) {
    console.error("Failed to add user:", err);
    setError("Could not add user.");
  }
};


  

  return (
    <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Search Users</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form className="d-flex mb-3">
          <Form.Control
            type="search"
            placeholder="Search by username"
            className="me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>

        {error && <div className="text-danger">{error}</div>}

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="chat-card" key={user._id} style={{display:"flex",justifyContent:"space-between",marginTop:"6px", marginBottom:"6px"}}>
              <div>
              <img
                src={user.profilepic}
                alt={user.Username}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <strong>{user.Username}</strong>
              </div>
              <div className="d-flex justify-content-end">
              <Button variant="outline-light" size="sm" onClick={() => handlesubmit(user._id)}>Add User</Button>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SearchUser;
