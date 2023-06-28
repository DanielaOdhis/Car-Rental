import React, { useState, useEffect } from 'react';
import './App.css';
import setting from './setting.png';
import Cars from './Cars.js';
import CarDetails from './CarDetails.js';
import Signup from './signup.js';
import Login from './login.js';
import Settings from './Settings.js';
import Profile from './Profile.js';

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const handleCarClick = (car) => {
    setSelectedCar(car);
    setShowProfilePage(false);
  };

  const handleBackClick = () => {
    setSelectedCar(null);
    setShowProfilePage(false);
  };

  const handleSignup = (formData) => {
    console.log('Signup form data:', formData);
    setShowLoginForm(true);
    setIsLoggedIn(true);
    setUser({ email: formData.email, username: formData.username });
  };

  const handleLogin = (formData) => {
    console.log('Login form data:', formData);
    setShowLoginForm(false);
    setIsLoggedIn(true);
    setUser({ email: formData.email, username: formData.username });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedCar(null);
    setShowLoginForm(true);
    setUser(null);
    setProfileData(null);
  };

  const handleDeleteAccount = () => {
    setIsLoggedIn(false);
    setSelectedCar(null);
    setShowLoginForm(true);
    setUser(null);
    setProfileData(null);
  };

  const handleProfileClick = () => {
    setSelectedCar(null);
    setShowProfilePage(true);
  };

  const handleClickOutsideDropdown = (event) => {
    const settingsButton = document.getElementById('settings-button');
    if (settingsButton && !settingsButton.contains(event.target)) {
      setShowSettings(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown);
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <div>
        {showLoginForm ? (
          <div className="login-form">
            <h1>Login</h1>
            <Login onLogin={handleLogin} />
            <p>
              Don't have an account?{' '}
              <button onClick={() => setShowLoginForm(false)}>Sign up</button>
            </p>
          </div>
        ) : (
          <div className="signup-form">
            <h1>Sign Up</h1>
            <Signup onSignUp={handleSignup} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setShowLoginForm(true)}>Login</button>
            </p>
          </div>
        )}
      </div>
    );
  } else {
    if (selectedCar && !showProfilePage) {
      return (
        <div>
          <CarDetails cars={selectedCar} onBackClick={handleBackClick} />
        </div>
      );
    } else if (showProfilePage) {
      return (
        <div>
          <Profile user={user} profileData={profileData} onBackClick={handleBackClick} />
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <Cars onCarClick={handleCarClick} />
          </div>
          <div className="settings-button" id="settings-button">
            <button onClick={() => setShowSettings(!showSettings)}>
              <img src={setting} alt="Settings" />
            </button>
            {showSettings && (
              <Settings
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
                onDeleteAccount={handleDeleteAccount}
                user={user}
              />
            )}
          </div>
        </div>
      );
    }
  }
}
