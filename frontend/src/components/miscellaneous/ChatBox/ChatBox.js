import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./ChatBox.css";
import io from "socket.io-client";
import CloseButton from "react-bootstrap/CloseButton";

const ENDPOINT = "http://localhost:5000";

const ChatBox = ({ chatId, currentUserId, handleClose }) => {
  const [message, setmessage] = useState([]);
  const [newmessage, setnewmessage] = useState();
  const socket=useRef();

  useEffect(() => {
    socket.current = io(ENDPOINT);

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
    });

    socket.current.on("message received", (newmessage) => {
      if(newmessage.chat._id===chatId){
      console.log("📩 message received:", newmessage);
      setmessage((prev) => [...prev, newmessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);
  useEffect(() => {
    if(chatId){
    socket.current.emit("join chat",chatId);
    const fetchChat = async () => {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const messages = await axios.get(`/api/message/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setmessage(messages.data);
    };
    fetchChat();
  }
  }, [chatId]);


  const sendMessage = async () => {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    if (!newmessage.trim()) {
      return;
    }
    const {data} = await axios.post(
      "/api/message",
      {
        sender: currentUserId,
        content: newmessage,
        chat: chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("axios response data:", data);
    socket.current.emit("new message",data)
    setnewmessage("");


  };
  return (
    <div className="chat-box">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div></div>
        <CloseButton onClick={handleClose} />
      </div>
      <div className="messages">
        {message?.map((m) => (
          <div
            key={m._id}
            className={`message ${
               (m.sender?._id)=== currentUserId
            ?"right":"left"}`}
          >
            <div style={{display: "flex",
              flexDirection: (m.sender?._id)=== currentUserId ? "row-reverse" : "row",}}>
              <img src={m.sender.profilepic} alt="no profile pic" key={m._id}
            className="profilepic" style={{width:"30px", height:"30px", borderRadius:"50%",objectFit: "cover"}}></img>
              <p className="Username">{m.sender.Username}</p>
            </div>
             <span className="message-content">{m.content}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={newmessage}
          onChange={(e) => setnewmessage(e.target.value)}
          placeholder="type a message"
        ></input><br/>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
