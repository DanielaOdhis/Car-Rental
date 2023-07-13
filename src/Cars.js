import React, { useState, useEffect } from 'react';

function Cars({ onCarClick }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/cars');
      const data = await response.json();
      console.log(data); // Check if the data is received correctly
      setCars(data);
    } catch (error) {
      console.error('Error Fetching Data', error);
    }
  };

  /*const bufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data || buffer.data.length === 0) {
      return '';
    }

    const binary = buffer.data.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    );

    const base64String = btoa(binary);

    return `data:${buffer.type};base64,${base64String}`;
  };*/

  const bufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data || buffer.data.length === 0) {
      return '';
    }
  
    const binary = buffer.data.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    );
  
    const base64String = btoa(binary);
  
    return `data:${buffer.type};base64,${base64String}`;
  };
  return (
    <div>
      <h1>Car Rental</h1>
      <div className='grid-container'>
        {cars.map((car, index) => {
          return (
            <div className="grid-item" key={index} onClick={() => onCarClick(car)}>
              <h2>{car.Car_Type}</h2>
              <img
  src={bufferToBase64(car.image)}
  alt={car.Car_Type}
/>
              <p>Availability Status: {car.Rental_Status}</p>
              <p>Price per Hour: {car.Charges_Per_Hour}$</p>
              <p>Price per Day: {car.Charges_Per_Day}$</p>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Cars;
