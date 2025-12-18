import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/signUp", {
        username,
        email,
        password,
        dob,
        gender,
        role: "CUSTOMER", // forced role
      })
      .then(() => {
        alert("Signup successful. Please sign in.");
        navigate("/sign_in_page");
      })
      .catch((err) => {
        console.error(err);
        alert("Signup failed");
      });
  };

  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="MALE"
                onChange={(e) => setGender(e.target.value)}
                required
              />{" "}
              Male
            </label>

            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              Female
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}
