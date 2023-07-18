import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookedCars({ onBackClick, profileData, carData }) {
  const [bookedCars, setBookedCars] = useState([]);

  useEffect(() => {
    if (profileData && profileData.id) {
      fetchBookedCars(profileData.id);
    }
  }, [profileData]);

  const fetchBookedCars = async (userId) => {

    try {
      const userResponse = await axios.get(`http://localhost:3004/api/userDetails/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const user = userResponse.data;

      if (user && user.id) {
        const response = await axios.get(`http://localhost:3004/api/bookedCars/${user.id}`);
        const bookedCars = response.data;

        const carsWithDetails = await Promise.all(
          bookedCars.map(async (bookedCar) => {
            const carDetailsResponse = await axios.get(`http://localhost:3004/api/cars/${bookedCar.car_id}`);
            const ownerDetailsResponse = await axios.get(`http://localhost:3004/api/ownerDetails/${carDetailsResponse.data[0].owner_ID}`);

            const carDetails = carDetailsResponse.data;

            return {
              ...bookedCar,
              car_details: carDetails,
              owner_details: ownerDetailsResponse.data,
            };
          })
        );

        setBookedCars(carsWithDetails);
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
         <div  className='booked-car-details'>
          {bookedCars.map((booking) => (
            <div className='booked' key={booking.id}>
             {booking.car_details.map((car) => (
            <div key={car.Car_ID}>
              <h2>{car.Car_Type}</h2>
              <img src={bufferToBase64(car.image)} alt={car.Car_Type} />
              <p><b>Owner's User Name </b>: {booking.owner_details.username}</p>
              <p><b>Owner's Telephone</b>: {booking.owner_details.phoneNumber}</p>
              <p><b>Booking Date</b>: {booking.booking_date}</p>
              <p><b>Pickup Time</b>: {booking.pickup_time}</p>
              <button onClick={onBackClick}>Back</button>
            </div>
          ))}
            </div>
          ))}
            </div>
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
