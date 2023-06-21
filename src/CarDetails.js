import React from 'react';

function CarDetails({ cars, onBackClick }) {
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
      {cars ? (
        <div className='selected-car-details'>
          <h2>{cars.Car_Type}</h2>
          <img src={bufferToBase64(cars.image)} alt={cars.Car_Type} />
          <p>Availability Status: {cars.Rental_Status}</p>
          <p>Price per Hour: {cars.Charges_Per_Hour}$</p>
          <p>Price per Day: {cars.Charges_Per_Day}$</p>
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
