import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingDialog from './Booking.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CarDetails() {
  const [carDetails, setCarDetails] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isBookingClicked, setIsBookingClicked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation().search;
  const carId = new URLSearchParams(location).get("carId");
  const fetchCarData = async () => {
    try {

      const response = await fetch(`http://localhost:3004/api/cars/${carId}`);
      const data = await response.json();
      console.log(data[0].owner_ID);
      setCarDetails(data[0]);
      try {
        const response = await axios.get(`http://localhost:3004/api/ownerDetails/${data[0].owner_ID}`, {
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
    } catch (error) {
      console.error('Error Fetching Data:: ', error);
    }
  };

  useEffect(() => {
    fetchCarData();
  }, );

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
    setCarDetails(null);
    navigate('/Cars');
  };

  const handleBookingClick = () => {
    setShowBookingDialog(true);
    setIsBookingClicked(true);
  };

  return (
    <div>
      <div className="selected">
        <div className="selected-container">
          {carDetails ? (
            <div className="selected-car-details">
              <br />
              <br />
              <img src={bufferToBase64(carDetails.image)} alt={carDetails.Car_Type} />
              <div className="avail">
                <br />
                <div className="select">
                  <p>Availability Status: {carDetails.Rental_Status}</p>
                </div>
                <div className="select">
                  <p>Price per Hour: {carDetails.Charges_Per_Hour}$</p>
                </div>
                <div className='select'>
                  <p>Location: {carDetails.Location}</p>
                </div>
                {ownerDetails && (
                  <div className="hidden">
                    <h2>Owner Details</h2>
                    <p>Owner Name: {ownerDetails.firstName}</p>
                    <p>Email: {ownerDetails.email}</p>
                    <p>Telephone: {ownerDetails.phoneNumber}</p>
                  </div>
                )}
              </div>
              <button onClick={handleBackClick}>Back</button>
              <button onClick={handleBookingClick}>Book</button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          {showBookingDialog && (
            <BookingDialog
              hourlyRate={carDetails.Charges_Per_Hour}
              carId={carDetails.Car_ID}
              carData={carDetails}
              onBookingClick={handleBookingClick}
              isBookingClicked={isBookingClicked}
            />
          )}
        </div>
      </div>
    </div>
  );
}
