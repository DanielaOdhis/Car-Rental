import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Update from './Update.jsx';
import { useNavigate } from 'react-router-dom';
import "../css/profile.css";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("loggedUser");

  const handleBackClick = () => {
    navigate('/Cars');
    localStorage.removeItem('profileData');
  }

  useEffect(() => {
    axios.get(`http://localhost:3004/api/userDetails/${userId}`)
      .then(response => {
        setProfileData(response.data);
        localStorage.setItem('profileData', JSON.stringify(response.data));
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, [userId]);

  return (
    <div className='profile'>
      <h1>Profile</h1>
      {profileData ? (
        <div>
          <p><b>Username:</b> {profileData.username}</p>
          <p><b>Email:</b> {profileData.email}</p>
          <p><b>First Name:</b> {profileData.firstName}</p>
          <p><b>Last Name:</b> {profileData.lastName}</p>
          <p><b>Phone Number:</b> {profileData.phoneNumber}</p>
        </div>
      ) : (
        <p>Loading profile data...</p>
      )}
      <button onClick={handleBackClick}>Back</button>
      <hr />
      <Update />
    </div>
  );
}
