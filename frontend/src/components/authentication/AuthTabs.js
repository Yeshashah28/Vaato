import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Login from "./Log-in";
import Signin from "./Signin";
import "../authentication/authentication.css";

const AuthTabs = () => {
  const [key, setKey] = useState("login");

  return (
    <div className="container d-flex full-height">
      {/* Left side with background image */}
      <div className="left-side bg-image"></div>

      {/* Right side with tabs */}
      <div className="right-side p-4">
        <Tabs
          id="auth-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          fill
        >
          <Tab eventKey="login" title="Login">
            <Login />
          </Tab>
          <Tab eventKey="signin" title="Signin">
            <Signin />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthTabs;
