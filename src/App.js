import React, { useState } from 'react';
import './App.css';
import Cars from './Cars.js';
import CarDetails from './CarDetails.js';
import Signup from './signup.js';
import Login from './login.js';

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const handleBackClick = () => {
    setSelectedCar(null);
  };

  const handleSignup = (formData) => {
    console.log('Signup form data:', formData);
    setShowLoginForm(true);
    setIsLoggedIn(true); // Set isLoggedIn to true after successful signup
  };

  const handleLogin = (formData) => {
    console.log('Login form data:', formData);
    setShowLoginForm(false);
    setIsLoggedIn(true); // Set isLoggedIn to true after successful login
  };

  if (!isLoggedIn) {
    return (
      <div>
        {showLoginForm ? (
          <div className="login-form">
            <h1>Login</h1>
            <Login onLogin={handleLogin} />
            <p>
              Don't have an account? <button onClick={() => setShowLoginForm(false)}>Sign up</button>
            </p>
          </div>
        ) : (
          <div className="signup-form">
            <h1>Sign Up</h1>
            <Signup onSignUp={handleSignup} />
            <p>
              Already have an account? <button onClick={() => setShowLoginForm(true)}>Login</button>
            </p>
          </div>
        )}
      </div>
    );
  } else {
    // Display car rental page if logged in
    return (
      <div>
        <div>
        {selectedCar ? (
          <CarDetails cars={selectedCar} onBackClick={handleBackClick} />
          ) : (
          <Cars onCarClick={handleCarClick} />
        )}
        </div>
      </div>
    );
  }
}
