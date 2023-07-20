import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingDialog from './Booking.js';

export default function CarDetails({ cars, onBackClick, userId, profileData }) {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isBookingClicked, setIsBookingClicked] = useState(false);
  const fetchOwnerDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3004/api/ownerDetails/${cars.owner_ID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setOwnerDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching owner details:', error);
    }
  };

  useEffect(() => {
    fetchOwnerDetails();
  },);

  const bufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data) {
      return '';
    }

    const bytes = new Uint8Array(buffer.data);
    const binary = bytes.reduce((str, byte) => str + String.fromCharCode(byte), '');
    const type = buffer.type.split('/')[1]; // Extract the file format from the MIME type
    const base64String = window.btoa(binary);
    return `data:image/${type};base64,${base64String}`;
  };

  const handleBackClick = () => {
    setShowBookingDialog(false);
    onBackClick();
  };

  const handleBookingClick = () => {
    setShowBookingDialog(true);
    setIsBookingClicked(true);
  };

  return (
    <div>
      {cars ? (
        <div className='selected-car-details'>
          <h2>{cars.Car_Type}</h2>
          <img src={bufferToBase64(cars.image)} alt={cars.Car_Type} />
          <p>Availability Status: {cars.Rental_Status}</p>
          <p>Price per Hour: {cars.Charges_Per_Hour}$</p>
          <p>Location: {cars.Location}</p>
          {ownerDetails && (
            <div>
              <h2>Owner Details</h2>
              <p>Owner Name: {ownerDetails.firstName}</p>
              <p>Email: {ownerDetails.email}</p>
              <p>Telephone: {ownerDetails.phoneNumber}</p>
            </div>
          )}
          <button onClick={handleBackClick}>Back</button>
          <button onClick={handleBookingClick}>Book</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {showBookingDialog && (
        <BookingDialog
          hourlyRate={cars.Charges_Per_Hour}
          carId={cars.Car_ID}
          profileData={profileData}
          carData={cars}
          onBookingClick={handleBookingClick}
          isBookingClicked={isBookingClicked}
        />
      )}
    </div>
  );
}
