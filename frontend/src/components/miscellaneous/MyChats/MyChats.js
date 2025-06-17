import Offcanvas from "react-bootstrap/Offcanvas";
import { useEffect, useState } from "react";
import axios from "axios";
import EditGroupModal from "../EditGroupModal/EditGroupModal";
import CloseButton from 'react-bootstrap/CloseButton';


const MyChats = ({ show, handleClose, onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState("");
  const [editGroup, setEditGroup] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = loggedUser.token;
        const response = await axios.get("/api/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChats(response.data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setError("Could not load chats.");
      }
    };

    if (show) fetchChats();
  }, [show]);

  const handleDelete=async(chatId)=>{
    const confirmDelete = window.confirm("Are you sure you want to delete this chat and all its messages?");
  if (!confirmDelete) return;

     const token=loggedUser.token;
     const response = await axios.delete(`/api/chat/deleteChat/${chatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         setChats((prev) =>prev.filter((chat) =>chat._id !== chatId));
  }

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Chats</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {error && <div className="text-danger">{error}</div>}
          <div className="chat-list">
            {chats.map((chat) => {
              const chatName = chat.isgroupchat
                ? chat.chatname
                : chat.users.find((u) => u._id !== loggedUser._id)?.Username;

              const chatUrl = chat.isgroupchat
                ? `https://api.dicebear.com/9.x/lorelei/svg?seed=${chatName}`
                : chat.users.find((u) => u._id !== loggedUser._id)?.profilepic;

              return (
                <div
                  className="chat-card"
                  key={chat._id}
                  style={{
                    marginBottom: "6px",
                    display: "flex",
                    textAlign: "left",
                    justifyContent: "space-between",
                  }}
                  onClick={() => {
                    onSelectChat(chat);
                  }}
                >
                  <div className="d-flex">
                    <div className="d-flex flex-column justify-content-center">
                      <img
                        src={chatUrl}
                        alt="no images found"
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "10px",
                          marginRight: "10px",
                        }}
                      ></img>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                      <h5 className="chat-title">{chatName}</h5>
                      <p className="chat-message" style={{textAlign: "left",}}>
                        {chat.latestmessage
                          ? `${
                              chat.latestmessage.sender?.Username || "User"
                            }: ${chat.latestmessage.content}`
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex flex-column justify-content-between align-items-end gap-2 me-2">
                    <CloseButton onClick={(e) => {
    e.stopPropagation();handleDelete(chat._id)}} title="Delete all messages in this chat" style={{ width: "5px", height: "5px" }}/>
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      style={{ height: "fit-content" }}
                      onClick={(e) => {e.stopPropagation();setEditGroup(chat)}}
                    >
                      Edit
                    </button>
    </div>
                </div>
              );
            })}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {editGroup && (
        <EditGroupModal
          chat={editGroup}
          handleClose={() => setEditGroup(null)}
          loggedUser={loggedUser}
          refreshChats={() => {
            const token = loggedUser.token;
            axios
              .get("/api/chat", {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => setChats(res.data));
          }}
        />
      )}
    </>
  );
};

export default MyChats;
