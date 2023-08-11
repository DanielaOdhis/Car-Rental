import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';

function Cars({ onCarClick }) {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/cars');
      const data = await response.json();
      setCars(data);
      setLoading(false);
    } catch (error) {
      console.error('Error Fetching Data', error);
      setLoading(false);
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
    <div className="grid">
      <h1>Car Rental</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by car type"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {loading ? (
        <div className="loading-container">
        <p className="loading-spinner">Loading...</p>
        </div>
      ) : (
        <div className="grid-container">
          {filteredCars.length > 0 ? (
            filteredCars.map((car, index) => (
              <div className="grid-item" key={index} onClick={() => onCarClick(car)}>
                <Link to={`/Car-Details?carId=${car.Car_ID}`} key={index} className="link">
                <h2>{car.Car_Type}</h2>
                <div className="triangles-container">
                <div className="triangle triangle-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="500" height="450" viewBox="0 0 277 274" fill="none">
  <g filter="url(#filter0_d_2_109)">
    <path d="M70.5308 232.751C54.943 238.049 43.4376 218.003 55.8759 207.216L241.173 46.5299C250.885 38.1072 266 45.0063 266 57.8623V155.563C266 161.986 261.91 167.697 255.828 169.765L70.5308 232.751Z" fill="#B38393"/>
  </g>
  <defs>
    <filter id="filter0_d_2_109" x="0.609192" y="-17.1668" width="315.391" height="290.793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-10"/>
      <feGaussianBlur stdDeviation="25"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_109"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_109" result="shape"/>
    </filter>
  </defs>
</svg>
                  </div>
                  <div className="triangle triangle-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="450" viewBox="0 0 277 292" fill="none">
  <g filter="url(#filter0_d_2_110)">
    <path d="M70.5308 250.466C54.943 255.765 43.4376 235.718 55.8759 224.932L241.173 64.2451C250.885 55.8225 266 62.7216 266 75.5776V173.278C266 179.702 261.91 185.412 255.828 187.48L70.5308 250.466Z" fill="#B38393"/>
  </g>
  <defs>
    <filter id="filter0_d_2_110" x="0.609192" y="0.548454" width="315.391" height="290.793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-10"/>
      <feGaussianBlur stdDeviation="25"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_110"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_110" result="shape"/>
    </filter>
  </defs>
</svg>
                  </div>
                  <div className="triangle triangle-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="380" viewBox="0 0 247 232" fill="none">
  <g filter="url(#filter0_d_2_111)">
    <path d="M40.5308 220.345C24.943 225.644 13.4376 205.597 25.8759 194.811L211.173 34.1244C220.885 25.7018 236 32.6009 236 45.4568V143.157C236 149.581 231.91 155.292 225.828 157.359L40.5308 220.345Z" fill="#B38393"/>
  </g>
  <defs>
    <filter id="filter0_d_2_111" x="0.609192" y="0.427719" width="255.391" height="230.793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-10"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_111"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_111" result="shape"/>
    </filter>
  </defs>
</svg>
                  </div>
                  </div>
                <img src={bufferToBase64(car.image)} alt={car.Car_Type} />
                  <div className="available">
                  <p>Availability Status: {car.Rental_Status}</p>
                  <p>Price per Hour: {car.Charges_Per_Hour}$</p>
                </div>
                </Link>
              </div>
            ))
          ) : (
            <p className='no-cars-message'>No Available Cars as for Now 😢</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Cars;