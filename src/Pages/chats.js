import React, { useState, useEffect } from 'react';

const Chats = () => {
  const [chatData, setChatData] = useState([]);
  const [selectedProfileChats, setSelectedProfileChats] = useState([]);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
    fetch('/chats.json')
      .then(response => response.json())
      .then(data => setChatData(data))
      .catch(error => console.error('Error fetching chat data:', error));
  }, []);

  const handleLastMessageClick = (profileChats) => {
    setSelectedProfileChats(profileChats);
    console.log("Chat Clicked");
  };

  const handleProfileClick = (profile) => {
    setShowProfilePopup(!showProfilePopup);
  };

  return (
    <div className="chat-list-container">
      <div className="chat-list">
        {chatData.map((chat, index) => (
          <div className="chat" key={index}>
            <img
              src={chat.profile}
              alt="Profile"
              className="profile-image"
              onClick={handleProfileClick}
            />
            <div className="chat-content">
              <div className="chat-details">
                <h3 className="username">{chat.username}</h3>
                <p
                  className={`message ${
                    chat.messages[chat.messages.length - 1].senderId === 1 ? 'sent' : 'received'
                  }`}
                >
                  <span
                    className="clickable-message"
                    onClick={() => handleLastMessageClick(chat.messages)}
                  >
                    {chat.messages[chat.messages.length - 1].message}
                  </span>
                </p>
              </div>
              <p className="time">{chat.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={`chat-list-content ${showProfilePopup ? 'blurred' : ''}`}>
      {showProfilePopup && selectedProfileChats && (
        <div className="profile-popup-overlay" >
          <div className="profile-popup">
            <div className="profile-popup-content">
              <img
                src={selectedProfileChats.profile}
                alt="Profile"
                className="profile-popup-image"
              />
            </div>
          </div>
        </div>
      )}
        <h1>Let's Chat</h1>
        {selectedProfileChats.map((message, index) => (
          <div key={index} className={`chat-message ${message.senderId === 1 ? 'S-sent' : 'R-received'}`}>
            {message.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
