import React, { useState } from 'react';
export default function Logins({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: email,
    };
    onLogin(formData);
    const loginData = { email, password };

    fetch('http://localhost:3004/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Invalid credentials');
      }
    })
    .then(data => {
      console.log(data);
      onLogin(email);
    })
    .catch(error => {
      console.error('Error:', error.message);
      setError('No Account Found. Please try again.');
    });
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br/><br/>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/><br/>
      <div>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={togglePasswordVisibility}
        />
        <label>Show Password</label>
      </div>
      {error && <p className='error'>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

