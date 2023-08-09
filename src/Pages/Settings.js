import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export default function Settings({ onLogout, onProfileClick, onDeleteAccount, user, onBookedClick }) {
  const [showPrompt, setShowPrompt] = useState(false);

  const navigate=useNavigate();
  const handlePrompt = () => {
    setShowPrompt(true);
  };

  const handleCancel = () => {
    setShowPrompt(false);
  };

  const handleProfile=()=>{
    onProfileClick();
    navigate('/profile');
  }

  const handleLogOut=()=>{
    onLogout();
    navigate('/');
  }

  const handleBook=()=>{
    onBookedClick();
    navigate('/Booked-Cars');
  }

  return (
    <div>
      <div className="settings-dropdown">
        <ul>
          <li onClick={handleProfile}>Profile</li>
          <li onClick={handleBook}>Booked Cars</li>
          <li onClick={handleLogOut}>Log Out</li>
          <li onClick={handlePrompt}>Delete Account</li>
        </ul>
      </div>
      {showPrompt && (
        <div className="delete-prompt">
          <p>Are you sure you want to delete your account?</p>
          <button onClick={onDeleteAccount}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </div>
  );
}
