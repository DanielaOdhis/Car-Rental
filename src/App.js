import React, { useState } from 'react';
import './App.css';
import Cars from './Cars.js';
import CarDetails from './CarDetails.js';

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);

  const handleCarClick = (cars) => {
    setSelectedCar(cars);
  };

  const handleBackClick = () => {
    setSelectedCar(null);
  };

  return (
    <div>
      {selectedCar ? (
        <CarDetails cars={selectedCar} onBackClick={handleBackClick} />
      ) : (
        <Cars onCarClick={handleCarClick} />
      )}
    </div>
  );
}
