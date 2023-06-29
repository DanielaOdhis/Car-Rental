import React, { useState, useEffect } from 'react';
import './App.css';
import setting from './setting.png';
import Cars from './Cars.js';
import CarDetails from './CarDetails.js';
import Signup from './signup.js';
import Login from './login.js';
import Settings from './Settings.js';
import Profile from './Profile.js';
import axios from 'axios';

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [user, setUser] = useState({ email: '' });
  const [profileData, setProfileData] = useState(null);

  const handleCarClick = (car) => {
    setSelectedCar(car);
    setShowProfilePage(false);
  };

  const handleBackClick = () => {
    setSelectedCar(null);
    setShowProfilePage(false);
  };

  const handleSignup = async (formData) => {
    try {
      console.log('Signup form data:', formData);
      setShowLoginForm(true);
      setIsLoggedIn(true);
      setUser({ email: formData.email });
      console.log(formData);

      await fetchProfileData(formData.email);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogin = async (formData) => {
    try {
      console.log('Login form data:', formData);
      setShowLoginForm(false);
      setIsLoggedIn(true);
      setUser({ email: formData.email });
      console.log(formData);

      const response = await fetchProfileData(formData.email);
      console.log(response);
      onLogin(formData.email);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedCar(null);
    setShowLoginForm(true);
    setUser(null);
    setProfileData(null);
  };

  const fetchProfileData = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3004/api/userDetails/${email}`);
      setProfileData(response.data);
      console.log('Profile data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw error;
    }
  };

  const handleDeleteAccount = () => {
    try {
      axios
        .delete(`http://localhost:3004/api/deleteAccount/${user.email}`)
        .then((response) => {
          console.log(response.data);
          handleLogout();
        })
        .catch((error) => {
          console.error(
            'Error deleting user account:',
            error.response.data
          );
        });
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
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

  const onLogin = (email) => {
    console.log('User logged in:', email);
  };

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
          <Profile
            user={user}
            profileData={profileData}
            isLoggedIn={isLoggedIn}
            showProfilePage={showProfilePage}
            onBackClick={handleBackClick}
          />
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
                onDeleteAccount={() => handleDeleteAccount(user.email)}
                user={user}
              />
            )}
          </div>
        </div>
      );
    }
  }
}
