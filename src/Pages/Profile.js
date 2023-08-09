import React from 'react';
import Update from './Update.js';
import { useNavigate } from 'react-router-dom';

export default function Profile({ profileData, onBackClick }) {
const navigate=useNavigate();

const handleBack=()=>{
  onBackClick();
  navigate('/Cars')
}
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
      <button onClick={handleBack}>Back</button>
      <hr/>
      <Update profileData={profileData}/>
    </div>
  );
}
