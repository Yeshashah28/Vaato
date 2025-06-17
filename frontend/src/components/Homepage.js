import {useEffect} from 'react'
import { useNavigate} from "react-router-dom";
import AuthTabs from './authentication/AuthTabs.js';

const Homepage = () => {
  const navigate=useNavigate();
    useEffect(()=>{
        const userInfo= JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo){
            navigate("/chats");
        }
    },[navigate]);
  return (
      <AuthTabs/>
  )
}

export default Homepage
