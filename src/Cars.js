import React, { useState, useEffect } from 'react';
import './App.css';

function Cars({ onCarClick }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error Fetching Data', error);
    }
  };

  return (
    <div>
      <h1>Car Rental</h1>
      <div className='grid-container'>
        {cars.map((car, index) => (
          <div className="grid-item" key={index} onClick={() => onCarClick(car)}>
            <h2>{car.Car_Type}</h2>
            <img src={car.image} alt={car.Car_Type} />
            <p>Availability Status: {car.Rental_Status}</p>
            <p>Price per Hour: {car.Charges_Per_Hour}</p>
            <p>Price per Day: {car.Charges_Per_Day}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;
