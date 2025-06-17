import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import {FaUserCircle } from "react-icons/fa";
import { useState} from "react";
import {useNavigate} from "react-router-dom";
import MyChats from "../MyChats/MyChats.js";
import MyProfile from "../MyProfile/MyProfile.js";
import SearchUser from "../SearchUser/SearchUser.js";
import ChatBox from "../ChatBox/ChatBox";
import CreateGroup from "../CreateGroup/CreateGroup.js";
import "../NavBar/NavBar.css";


const NavBar = () => {
  const [showChats, setShowChats] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
   const [selectedChat, setSelectedChat] = useState(null);
  const navigate=useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  const handleSelect = (eventKey) => {
    if (eventKey === "MyProfile") {
      setShowProfileModal(true);
    }
    if(eventKey === "LogOut"){
      localStorage.clear();
      navigate("/");
    }
  };

  const handleClose = () => setShowProfileModal(false);
  const handleCloseChat=()=>setSelectedChat(false);

  return (
    <>
    <div className="navbar-container">
      <Navbar variant="dark" className="custom-navbar">
        <Container
          fluid
          className="d-flex align-items-center justify-content-between position-relative"
        >
          {/* Search Form (Left) */}
          <Button variant="light" className="chat-button mx-3" onClick={() => setShowChats(true)}>
            Chats
          </Button>

          <MyChats show={showChats} handleClose={() => setShowChats(false)} onSelectChat={(chat)=>{setSelectedChat(chat); {setShowChats(false)};}}/>

          <Button variant="light" className="search-button mx-3" onClick={() => setShowUsers(true)}>
            Search User
          </Button>

          <SearchUser show={showUsers} handleClose={() => setShowUsers(false)} />

          <Button variant="light" className="search-button mx-3" onClick={() => setShowModal(true)}>
            Create Group
          </Button>

          <CreateGroup show={showModal} handleClose={() => setShowModal(false)} />

          {/* Centered Brand */}
          <Navbar.Brand className="mx-auto centered-brand">
            Vaato
          </Navbar.Brand>

          {/* Icons (Right) */}
            <Dropdown onSelect={handleSelect} align={{ lg: 'end' }}>
              <Dropdown.Toggle variant="light"><FaUserCircle size={24} color="black" className="cursor-pointer" /></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="MyProfile">My Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="LogOut">LogOut</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="mt-3">
              <MyProfile show={showProfileModal} handleClose={handleClose} user={loggedUser} />
            </div>
        </Container>
      </Navbar>
       <div id="welcome-message">
  <h2>વાતોમાં આપનું સ્વાગત છે</h2>
</div>
    </div>
     {selectedChat && (
        <div className="chatbox-wrapper">
          <ChatBox chatId={selectedChat._id} currentUserId={loggedUser._id} handleClose={handleCloseChat}/>
        </div>
      )}
      </>
  );
};

export default NavBar;
