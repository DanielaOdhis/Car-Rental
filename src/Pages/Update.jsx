import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Update() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profileData, setProfileData] = useState(null);

  const userId = localStorage.getItem('loggedUser');

  useEffect(() => {
    axios
      .get(`http://localhost:3004/api/userDetails/${userId}`)
      .then((response) => {
        response.preventDefault();
        setProfileData(response.data);
        const { username, email, firstName, lastName, phoneNumber, password } = response.data;
        setUsername(username);
        setEmail(email);
        setFirstName(firstName);
        setLastName(lastName);
        setPhoneNumber(phoneNumber);
        setPassword(password);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  }, [userId]);

  const handleUpdateClick = async (e) => {
    e.preventDefault();
    if (!username || !password || !email || !firstName || !lastName || !phoneNumber) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    await axios
      .put(`http://localhost:3004/api/userDetails/${userId}`, {
        username,
        email,
        firstName,
        lastName,
        phoneNumber,
        password,
      })
      .then((response) => {
        response.preventDefault();
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div>
        <form onSubmit={handleUpdateClick}>
          <h2>Update Details</h2>
          <div>
            <input
              type="text"
              placeholder="First Name"
              defaultValue={firstName}
              onChange={(e) => { e.preventDefault(); setFirstName(e.target.value) }}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Last Name"
              defaultValue={lastName}
              onChange={(e) => { e.preventDefault(); setLastName(e.target.value) }}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Telephone Number"
              defaultValue={phoneNumber}
              onChange={(e) => { e.preventDefault(); setPhoneNumber(e.target.value) }}
            />
            <br />
            <br />
            <input
              type="tel"
              placeholder="Username"
              defaultValue={username}
              onChange={(e) => { e.preventDefault(); setUsername(e.target.value) }}
            />
            <br />
            <br />
            <input type="email" placeholder="Email" value={email} readOnly />
            <br />
            <br />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              defaultValue={password}
              onChange={(e) => { e.preventDefault(); setPassword(e.target.value) }}
            />
            <br />
            <br />
            <div>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={togglePasswordVisibility}
              />
              <label>Show Password</label>
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
