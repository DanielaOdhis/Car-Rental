import React, { useState, useEffect } from 'react';
import './App.css';

function Cars({ onCarClick }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const response = await fetch('http://localhost:3003/api/cars');
      const data = await response.json();
      console.log(data); // Check if the data is received correctly
      setCars(data);
    } catch (error) {
      console.error('Error Fetching Data', error);
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
      <h1>Car Rental</h1>
      <div className='grid-container'>
        {cars.map((car, index) => (
          <div className="grid-item" key={index} onClick={() => onCarClick(car)}>
            <h2>{car.Car_Type}</h2>
            <img src={bufferToBase64(car.image)} alt={car.Car_Type} />
            <p>Availability Status: {car.Rental_Status}</p>
            <p>Price per Hour: {car.Charges_Per_Hour}$</p>
            <p>Price per Day: {car.Charges_Per_Day}$</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;
