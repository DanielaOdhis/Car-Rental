import React, { useState } from 'react';

export default function Signup({ onSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userData = { username, email, password, firstName, lastName, phoneNumber };

    fetch('http://localhost:3004/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        onSignUp();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      /><br /><br />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      /><br /><br />
      <input
        type="text"
        placeholder="Telephone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      /><br /><br />
      <input
        type="tel"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br /><br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button type="submit">Signup</button>
    </form>
  );
}
