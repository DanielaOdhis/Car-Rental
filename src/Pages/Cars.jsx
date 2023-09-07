import React, { useState, useEffect } from 'react';
import CarDetails from './CarDetails';
import { Link} from 'react-router-dom';

function Cars() {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const[selectedCar, setSelectedCar]= useState(null);

  useEffect(() => {
    fetchCarData();
  }, );

  const fetchCarData = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/cars');
      const data = await response.json();
      setCars(data);
      console.log("local:",localStorage.getItem("loggedUser"));
      setLoading(false);
    } catch (error) {
      console.error('Error Fetching Data', error);
      setLoading(false);
    }
  };

  const handleCarClick = (car) => {
    setSelectedCar(car);
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
    !selectedCar ? (
    <div className="grid">
      <h1>Car Rental</h1>
      <div className="search-container">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M11.5 2.75C13.1667 2.74996 14.7987 3.22594 16.2041 4.12194C17.6095 5.01793 18.7297 6.29666 19.433 7.80769C20.1363 9.31873 20.3934 10.9992 20.1741 12.6514C19.9548 14.3036 19.2682 15.8588 18.195 17.134L25.03 23.97C25.163 24.104 25.2405 24.2832 25.2472 24.4719C25.2538 24.6605 25.1891 24.8447 25.0659 24.9878C24.9427 25.1308 24.7701 25.2221 24.5825 25.2434C24.3949 25.2648 24.2062 25.2147 24.054 25.103L23.97 25.03L17.134 18.195C16.0573 19.101 14.778 19.734 13.4046 20.0403C12.0312 20.3465 10.6041 20.317 9.24452 19.9542C7.88491 19.5915 6.63286 18.9062 5.59455 17.9564C4.55623 17.0067 3.76229 15.8205 3.28007 14.4985C2.79785 13.1766 2.64157 11.7578 2.82449 10.3626C3.0074 8.96737 3.52412 7.63683 4.33081 6.48385C5.1375 5.33087 6.21037 4.38946 7.45842 3.73945C8.70646 3.08945 10.0929 2.75004 11.5 2.75ZM11.5 4.25C9.57721 4.25 7.73314 5.01384 6.3735 6.37348C5.01386 7.73311 4.25003 9.57718 4.25003 11.5C4.25003 13.4228 5.01386 15.2669 6.3735 16.6265C7.73314 17.9862 9.57721 18.75 11.5 18.75C13.4228 18.75 15.2669 17.9862 16.6265 16.6265C17.9862 15.2669 18.75 13.4228 18.75 11.5C18.75 9.57718 17.9862 7.73311 16.6265 6.37348C15.2669 5.01384 13.4228 4.25 11.5 4.25Z" fill="black"/>
</svg>
        </div>
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
              <div className="grid-item" key={index} onClick={() => handleCarClick(car)}>
                <Link to={`/Car-Details?carId=${car.Car_ID}`} key={index} className="link">
                <h2>{car.Car_Type}</h2>
                <div className="triangles-container">
                <div className="triangle triangle-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="500" height="450" viewBox="0 0 277 274" fill="none">
  <g filter="url(#filter0_d_1_9)">
    <path d="M70.5308 232.751C54.943 238.049 43.4376 218.003 55.8759 207.216L241.173 46.5299C250.885 38.1072 266 45.0063 266 57.8623V155.563C266 161.986 261.91 167.697 255.828 169.765L70.5308 232.751Z" fill="#9B8079"/>
  </g>
  <defs>
    <filter id="filter0_d_1_9" x="0.609161" y="-17.1668" width="315.391" height="290.793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-10"/>
      <feGaussianBlur stdDeviation="25"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_9"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_9" result="shape"/>
    </filter>
  </defs>
</svg>
                  </div>
                  <div className="triangle triangle-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="450" viewBox="0 0 277 292" fill="none">
  <g filter="url(#filter0_d_1_10)">
    <path d="M70.5308 250.466C54.943 255.765 43.4376 235.718 55.8759 224.932L241.173 64.2451C250.885 55.8225 266 62.7216 266 75.5776V173.278C266 179.702 261.91 185.412 255.828 187.48L70.5308 250.466Z" fill="#9B8079"/>
  </g>
  <defs>
    <filter id="filter0_d_1_10" x="0.609161" y="0.548454" width="315.391" height="290.793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-10"/>
      <feGaussianBlur stdDeviation="25"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_10"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_10" result="shape"/>
    </filter>
  </defs>
</svg>
                  </div>
                  <div className="triangle triangle-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="360" viewBox="0 0 247 232" fill="none">
  <g filter="url(#filter0_d_1_11)">
    <path d="M40.5308 220.345C24.943 225.644 13.4376 205.597 25.8759 194.811L211.173 34.1244C220.885 25.7018 236 32.6009 236 45.4568V143.157C236 149.581 231.91 155.292 225.828 157.359L40.5308 220.345Z" fill="#9B8079"/>
  </g>
  <defs>
    <filter id="filter0_d_1_11" x="0.609161" y="0.427719" width="255.391" height="230.793" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-10"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_11"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_11" result="shape"/>
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
    ):(
      <CarDetails cars={selectedCar}/>
    )
  );
}

export default Cars;