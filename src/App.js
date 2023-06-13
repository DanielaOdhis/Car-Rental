import React, { useState } from 'react';
import './App.css';
import Cars from './Cars.js';
import CarDetails from './CarDetails.js';

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const handleBackClick = () => {
    setSelectedCar(null);
  };

  return (
    <div>
      {selectedCar ? (
        <CarDetails car={selectedCar} onBackClick={handleBackClick} />
      ) : (
        <Cars onCarClick={handleCarClick} />
      )}
    </div>
  );
}
