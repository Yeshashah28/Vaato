import { Route, Routes } from 'react-router-dom';
import Homepage from "./components/Homepage.js";
import Signin from "./components/authentication/Signin.js";
import Login from "./components/authentication/Log-in.js";
import Chatpage from "./components/Chatpage.js";
import MyChats from "./components/miscellaneous/MyChats/MyChats.js";

function App() {
  return (
    <div className='App'>
      <Routes>
      <Route path="/" element={<Homepage/>} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/chats" element={<Chatpage />} />
        <Route path="/MyChats" element={<MyChats />} />
     </Routes>
     </div>
  );
}

export default App;
