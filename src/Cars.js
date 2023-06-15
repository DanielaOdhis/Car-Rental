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

  return (
    <div>
      <h1>Car Rental</h1>
      <div className='grid-container'>
        {cars.map((cars, index) => (
          <div className="grid-item" key={index} onClick={() => onCarClick(cars)}>
            <h2>{cars.Car_Type}</h2>
            <img src={cars.image} alt={cars.Car_Type} />
            <p>Availability Status: {cars.Rental_Status}</p>
            <p>Price per Hour: {cars.Charges_Per_Hour}</p>
            <p>Price per Day: {cars.Charges_Per_Day}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;
