import React, { useState, useEffect } from 'react';
import './App.css';

function Cars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const response = await fetch('car.json')
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error Fetching Data", error);
    }
  }

  return (
    <div>
      <h1>Cars</h1>
      {cars.map((car, index) => {
        return (
         <div key={index}>
            <h2>{car.type}</h2>
            <p>Availability Status: {car.Rental_status}</p>
            <p>Price per Hour: {car.charges.per_hour}</p>
            <p>Price per Day: {car.charges.per_day}</p>
            <hr />
         </div>
        );
      })}
    </div>
  );
}

export default Cars;
