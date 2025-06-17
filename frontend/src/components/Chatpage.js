import {ChatState} from "../context/Chat_Provider.js"
import "../components/Chatpage.css"
import NavBar from "./miscellaneous/NavBar/NavBar.js";
import MyChats from "./miscellaneous/MyChats/MyChats.js";
import ChatBox from "./miscellaneous/ChatBox/ChatBox.js";

const Chatpage = () => {
   const {user}=ChatState();
  return (
    <div className="chatpage-container">
     {user && <NavBar/>}
     <div>
      {/* {user && <MyChats/>} */}
      {/* {user && <ChatBox/>} */}
     </div>
    </div>
  )
}

export default Chatpage
