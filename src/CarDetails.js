import React from 'react';

function CarDetails({ cars, onBackClick }) {
  return (
    <div>
      {cars ? (
        <div class='selected-car-details'>
          <h2>{cars.type}</h2>
          <img src={process.env.PUBLIC_URL + '/' + cars.image} alt={cars.Car_Type} />
          <p>Availability Status: {cars.Rental_Status}</p>
          <p>Price per Hour: {cars.Charges_Per_Hour}</p>
          <p>Price per Day: {cars.Charges_Per_Day}</p>
          <p>Location: {cars.Location}</p>
          <p>Owner Name: {cars.Owner_Name}</p>
          <p>Email: {cars.Owner_Email}</p>
          <p>Telephone: {cars.Owner_Telephone}</p>
          <button onClick={onBackClick}>Back</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CarDetails;
