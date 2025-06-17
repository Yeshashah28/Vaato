import React from 'react';
import { Modal, Button} from 'react-bootstrap';

const MyProfile = ({ show, handleClose, user }) => {
  console.log("User in MyProfile:", user.profilepic);
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title style={{ width: "100%", textAlign:"center" }}>{user.Username}'s Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
        
        <img
    src={user.profilepic}
    alt="Profile"
    style={{ width: "100px", height: "100px", borderRadius: "50%", margin: "0 auto", display: "block" }}
  />
        <h5>{user.Username}</h5>
        <p>{user.Email}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyProfile;
