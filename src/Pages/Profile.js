import React, {useEffect} from 'react';
import Update from './Update.js';
import { useNavigate } from 'react-router-dom';

export default function Profile({ profileData }) {
const navigate=useNavigate();

const handleBack=()=>{
  navigate('/Cars');
  localStorage.removeItem('profileData');
}

useEffect(() => {
  localStorage.setItem('profileData', JSON.stringify(profileData));
}, [profileData]);

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
