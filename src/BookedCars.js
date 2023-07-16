import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookedCars({ onBackClick, profileData }) {
  const [bookedCars, setBookedCars] = useState([]);

  useEffect(() => {
    if (profileData && profileData.id) {
      fetchBookedCars(profileData.id);
    }
  }, [profileData]);

  const fetchBookedCars = async (userId) => {
    console.log('Fetching Booked Cars for user ID:', userId);

    try {
      const userResponse = await axios.get(`http://localhost:3004/api/userDetails/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const user = userResponse.data;

      if (user && user.id) {
        const response = await axios.get(`http://localhost:3004/api/bookedCars/${user.id}`);
        setBookedCars(response.data);
      } else {
        console.error('Invalid user data:', user);
      }
    } catch (error) {
      console.error('Error fetching booked cars:', error);
    }
  };

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

  return (
    <div>
      <h1>Booked Cars</h1>
      {bookedCars.length > 0 ? (
        <div>
          {bookedCars.map((car) => (
            <div className='booked-car-details' key={car.id}>
              <img src={bufferToBase64(car.car_image)} alt={car.car_type} />
              <h2>{car.car_type}</h2>
              <p>Owner's Email: {car.owner_email}</p>
              <p>Owner's Telephone: {car.owner_telephone}</p>
              <p>Booking Date: {car.booking_date}</p>
              <p>Pickup Time: {car.pickup_time}</p>
              <button onClick={onBackClick}>Back</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="no-cars-message">No booked cars found.</p>
          <button onClick={onBackClick}>Back</button>
        </div>
      )}
    </div>
  );
}
