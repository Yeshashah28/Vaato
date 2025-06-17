import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import axios from "axios";

const EditGroupModal = ({ chat, handleClose, loggedUser, refreshChats }) => {
  const [groupName, setGroupName] = useState(chat.chatname);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedUsers(
      chat.users.map((u) => ({
        value: u._id,
        label: u.Username,
        image: u.profilepic,
      }))
    );

    const fetchAllUsers = async () => {
      const config = {
        headers: { Authorization: `Bearer ${loggedUser.token}` },
      };
      const { data } = await axios.get("/api/user", config);
      const options = data.map((u) => ({
        value: u._id,
        label: u.Username,
        image: u.profilepic,
      }));
      setAllUsers(options);
    };

    fetchAllUsers();
  }, [chat]);

  const handleRename = async () => {
    try {
      await axios.post(
        "/api/chat/rename",
        { chatId: chat._id, chatName: groupName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
          },
        }
      );
      refreshChats();
      handleClose();
    } catch (err) {
      console.error(err.response?.data?.message);
    }
  };

  const handleUserChange = async (selected) => {
    setLoading(true);
    const existingIds = chat.users.map((u) => u._id);
    const newIds = selected.map((s) => s.value);

    const toAdd = newIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !newIds.includes(id));

    const config = {
      headers: { Authorization: `Bearer ${loggedUser.token}` },
    };

    try {
      for (const userId of toAdd) {
        await axios.post("/api/chat/groupAdd", { chatId: chat._id, userId }, config);
      }

      for (const userId of toRemove) {
        await axios.post("/api/chat/groupRemove", { chatId: chat._id, userId }, config);
      }

      refreshChats();
      setSelectedUsers(selected);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Group Members</Form.Label>
            <Select
              isMulti
              value={selectedUsers}
              onChange={handleUserChange}
              options={allUsers}
              isDisabled={loading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="dark" onClick={handleRename} disabled={loading}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditGroupModal;
