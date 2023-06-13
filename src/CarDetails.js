import React from 'react';

function CarDetails({ car, onBackClick }) {
  return (
    <div>
      {car ? (
        <div class='selected-car-details'>
          <h2>{car.type}</h2>
          <img src={process.env.PUBLIC_URL + '/' + car.image} alt={car.type} />
          <p>Availability Status: {car.Rental_status}</p>
          <p>Price per Hour: {car.charges.per_hour}</p>
          <p>Price per Day: {car.charges.per_day}</p>
          <p>Location: {car.location}</p>
          <p>Owner Name: {car.owner_details.name}</p>
          <p>Email: {car.owner_details.contacts.email}</p>
          <p>Telephone: {car.owner_details.contacts.tel}</p>
          <button onClick={onBackClick}>Back</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CarDetails;
