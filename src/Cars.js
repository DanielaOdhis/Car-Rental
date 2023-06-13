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
              <h2>{car.type}</h2>
              <img src={process.env.PUBLIC_URL + '/' + car.image} alt={car.type} />
              <p>Availability Status: {car.Rental_status}</p>
              <p>Price per Hour: {car.charges.per_hour}</p>
              <p>Price per Day: {car.charges.per_day}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;
