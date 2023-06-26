import React, { useState } from 'react';

export default function Logins({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const loginData = { email, password };

    fetch('http://localhost:3004/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      onLogin();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <form  onSubmit={handleFormSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br/><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/><br/>
      <button type="submit">Login</button>
    </form>
  );
}
