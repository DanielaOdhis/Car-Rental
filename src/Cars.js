import React, { useState, useEffect } from 'react';

function Cars({ onCarClick }) {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterCars = (car) => {
    const { Car_Type, Rental_Status } = car;
    const query = searchQuery.toLowerCase();
    const rentalStatus = Rental_Status.toLowerCase();

    const matchesQuery = Car_Type.toLowerCase().includes(query);
    const matchesRentalStatus = rentalStatus === 'available';

    return matchesQuery && matchesRentalStatus;
  };

  const filteredCars = cars.filter(filterCars);

  return (
    <div>
      <h1>Car Rental</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by car type"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="grid-container">
        {filteredCars.length > 0 ? (
          filteredCars.map((car, index) => (
            <div className="grid-item" key={index} onClick={() => onCarClick(car)}>
              <h2>{car.Car_Type}</h2>
              <img src={bufferToBase64(car.image)} alt={car.Car_Type} />
              <p>Availability Status: {car.Rental_Status}</p>
              <p>Price per Hour: {car.Charges_Per_Hour}$</p>
              <p>Price per Day: {car.Charges_Per_Day}$</p>
              <hr />
            </div>
          ))
        ) : (
          <p className='no-cars-message'>No Available Cars as for Now 😢</p>
        )}
      </div>
    </div>
  );
}

export default Cars;
