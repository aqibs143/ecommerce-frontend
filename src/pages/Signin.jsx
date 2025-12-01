import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/signIn', { username, password })
      .then(res => {
        localStorage.setItem('username', username);
        const role = res.data;
        if (role === 'admin') navigate('/admin_page');
        else if (role === 'customer') navigate('/customer_page');
        else alert('Unknown role: ' + role);
      })
      .catch(() => alert('Error signing in – check console'));
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
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Sign In</button>
      </form>
    </div>
  );
}
