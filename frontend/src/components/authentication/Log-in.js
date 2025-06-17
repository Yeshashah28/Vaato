import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../authentication/authentication.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [Email, setemail] = useState("");
  const [Password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const showAlert = (message, variant = "warning") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!Email || !Password) {
      showAlert("Please fill all the fields", "warning");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { Email, Password },
        config
      );

      showAlert("Login Successful", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      window.alert("incorrect credentials");
      setLoading(false);
    }
  };
  return (
    <div className="container d-flex">
        {alert.show && (
          <div className={`alert alert-${alert.variant}`} role="alert">
            {alert.message}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <h1>Login</h1>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Enter Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={Email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Enter Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setpassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="dark" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
    </div>
  );
};

export default Login;
