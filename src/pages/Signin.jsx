import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/auth/login", {
        username,
        password,
      })
      .then((res) => {
        const token = res.data;

        // Decode JWT
        const decoded = jwtDecode(token);

        // Typical structures:
        // decoded.role = "ROLE_ADMIN"
        // OR decoded.roles = ["ROLE_ADMIN"]
        const role =
          decoded.role ||
          (Array.isArray(decoded.roles) ? decoded.roles[0] : null);

        if (!role) {
          alert("Role not found in token");
          return;
        }
        //const decoded = jwtDecode(token);
        console.log("DECODED TOKEN ", decoded);
        console.log("ROLE ", decoded.role);

        // Save auth data
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        // Normalize role
        const cleanRole = role.replace("ROLE_", "").toLowerCase();

        // Redirect
        if (cleanRole === "admin") {
          navigate("/admin_page");
        } else {
          navigate("/customer_page");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Invalid username or password");
      });
  };

  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}
