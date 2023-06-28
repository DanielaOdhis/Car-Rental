import React, { useState } from 'react';

export default function Settings({ onLogout, onProfileClick, onDeleteAccount }) {
  const [showPrompt, setShowPrompt] = useState(false);

  const handlePrompt = () => {
    setShowPrompt(true);
  };

 const handleDeleteAccount = () => {
    fetch('http://localhost:3004/api/deleteAccount', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          console.log('Account deleted successfully');
          onDeleteAccount();
        } else {
          console.error('Failed to delete account');
        }
      })
      .catch(error => {
        console.error('Failed to delete account:', error);
      });
  };

  const handleCancel = () => {
    setShowPrompt(false);
  };

  return (
    <div >
      <div className="settings-dropdown">
      <ul>
        <li onClick={onProfileClick}>Profile</li>
        <li onClick={onLogout}>Log Out</li>
        <li onClick={handlePrompt}>Delete Account</li>
      </ul>
      </div>
      {showPrompt && (
        <div className="delete-prompt">
          <p>Are you sure you want to delete your account?</p>
          <button onClick={handleDeleteAccount}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </div>
  );
}
