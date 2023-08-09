import React, { useState } from 'react';
import Login from './login.js';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUpForm, setSignUpForm] = useState(true);

  const navigate= useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: email,
    };
    onSignUp(formData);
    if (!username || !password || !email || !firstName || !lastName || !phoneNumber) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const userData = { username, email, password, firstName, lastName, phoneNumber };

    fetch('http://localhost:3004/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        onSignUp(email); // Pass the email value to the onSignUp function
        navigate('/Cars');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    setSignUpForm(false);
    navigate('/');
  };

  return (
    <div>
      {showSignUpForm ? (
        <div className="background-container">
          <div className="signup-form">
            <form onSubmit={handleFormSubmit}>
              <h1>Sign Up</h1>
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /><br /><br />
              <div>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                <label>Show Password</label>
              </div>
              <div>
              <button type="submit">Signup</button>
              </div>
              <p>
                Already have an account?{' '}
                <button onClick={handleLogin}>Login</button>
              </p>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
