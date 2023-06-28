import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile({ userId, onBackClick, isLoggedIn, showProfilePage }) {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/api/userDetails?id=${encodeURIComponent(userId)}`);
        setProfileData(response.data);
        console.log('Profile data:', response);
      } catch (error) {
        console.error('Error fetching person:', error);
      }
    };
    fetchPerson();
  }, [userId]);

  useEffect(() => {
    if (!isLoggedIn || !showProfilePage) {
      setProfileData(null);
    }
  }, [isLoggedIn, showProfilePage]);

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
      <button onClick={onBackClick}>Back</button>
    </div>
  );
}

