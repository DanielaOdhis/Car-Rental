import React, { useState } from 'react';
import Login from './login.js';
import { useNavigate } from 'react-router-dom';

export default function Forgot({ onBack }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(true);

  const navigate= useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setIsSubmitted(true);

    setEmail('');
    setError('');
  };

  const handleLoginClick = () => {
    onBack();
    setShowForgot(false);
    navigate('/');
  };

  return (
    <div>
      {showForgot ? (
        <div className="background-container">
        <div className="forgot">
          <h1>Forgot Password</h1>
          {isSubmitted ? (
            <>
              <p className="success-message">
                An email with password reset instructions has been sent to your email address.
              </p>
              <button onClick={handleLoginClick}>Login</button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br /><br />
              {error && <p className="error-message">{error}</p>}
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
        </div>
      ) : (
        <Login onLogin={handleLoginClick} />
      )}
    </div>
  );
}
