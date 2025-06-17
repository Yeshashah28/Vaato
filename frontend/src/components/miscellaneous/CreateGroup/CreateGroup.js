import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Select, { components } from "react-select";

const CreateGroup = ({ show, handleClose }) => {
  const [ groupName, setGroupName ] = useState("");
  const [ allUsers, setAllUsers ] = useState([]);
  const [ selectedUsers, setSelectedUsers ] = useState([]);
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  const CustomOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps} style={{ display: "flex", alignItems: "center", padding: 8 }}>
      <img
        src={data.image || "https://via.placeholder.com/30"} // fallback image
        alt={data.label}
        style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
      />
      <span>{data.label}</span>
    </div>
  );
};

// 🏷️ Custom selected value chip with image
const CustomMultiValueLabel = (props) => (
  <components.MultiValueLabel {...props}>
    <img
      src={props.data.image}
      alt={props.data.label}
      style={{ width: 20, height: 20, borderRadius: "50%", marginRight: 5 }}
    />
    {props.data.label}
  </components.MultiValueLabel>
);

  useEffect(() => {
    const fetchUsers = async () => {
      try{
         const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
const { data } = await axios.get("/api/user",config);
      const useroptions = data.map((x) => ({
        value: x._id,
        label: x.Username,
        image: x.profilepic,
      }));
      setAllUsers(useroptions);
      }catch(error){
        console.log(error.message);
      }
      
    };
    fetchUsers();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName || selectedUsers.length < 2) {
      alert("please enter group name and select atleast 2 members");
      return;
    }
    const userIds = selectedUsers.map((user) => user.value);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(userIds),
        },
        config
      );

      console.log("group created", data);
      setGroupName("");
      setSelectedUsers([]);
      handleClose();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };
  return (
     <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Group Chat</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{display:"flex", justifyContent:"center"}}>
        <Form onSubmit={handleCreateGroup}>
          <Form.Group>
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Select Users</Form.Label>
            <Select
              isMulti
              options={allUsers}
              value={selectedUsers}
              onChange={(selected) => setSelectedUsers(selected)}
              placeholder="Choose users..."
              components={{
                Option: CustomOption,
                MultiValueLabel: CustomMultiValueLabel,
              }}
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="mt-3">
            Create Group
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGroup;
