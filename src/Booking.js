import React, { useState } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function BookingDialog({ hourlyRate, dailyRate, carId, profileData, carData, onBookingClick, isBookingClicked }) {
  const [paymentOption, setPaymentOption] = useState('');
  const [totalBill, setTotalBill] = useState(0);
  const [pickupTime, setPickupTime] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false); // New state variable

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setPaymentOption(selectedOption);

    if (selectedOption === 'hourly') {
      setTotalBill(hourlyRate);
    } else if (selectedOption === 'daily') {
      setTotalBill(dailyRate);
    }
  };

  const handleCheckoutComplete = () => {
    setPaymentOption('');
    setTotalBill(0);
  };

  const handleBackClick = () => {
    setPaymentOption('');
  };

  const handleBookClick = async () => {
    if (!pickupTime || !bookingDate) {
      console.error('Missing required data for booking');
      return;
    }

    const formData = new FormData();
    formData.append('pickup_time', pickupTime);
    formData.append('user_id', profileData.id);
    formData.append('booking_date', bookingDate);
    formData.append('car_id', carData.Car_ID);
  
    try {
      const userResponse = await axios.get(`http://localhost:3004/api/userDetails/${profileData.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const carResponse = await axios.get(`http://localhost:3004/api/cars/${carData.owner_ID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const user = userResponse.data;
      const car = carResponse.data;
      console.log('profileData:', profileData);
    console.log('carData:', carData);
      
      if (!user || !user.id) {
        console.error('Invalid user data:', user);
        return;
      }
  
      if (!car || !car.Car_ID) {
        console.error('Invalid car data:', car);
        return;
      }

      formData.append('user_id', user.id);
      formData.append('car_id', car.Car_ID);

      const formattedPickupTime = `${bookingDate} ${pickupTime}:00`;
  
      axios.post('http://localhost:3004/api/bookings',  {
        pickup_time: formattedPickupTime,
        user_id: profileData.id,
        booking_date: bookingDate,
        car_id: carData.Car_ID
      })
        .then((response) => {
          console.log(response.data);
          onBookingClick(); // Call the onBookingClick callback
          setPaymentOption('paypal'); // Set paymentOption state to 'paypal'
          setShowPaymentOptions(true); // Set showPaymentOptions state to true
        })
        .catch((error) => {
          console.error('Error creating booking:', error.response.data);
        });
    } catch (error) {
      console.error('Error fetching user or car details:', error);
    }}

  return (
    <div>
      {!isBookingClicked && !showPaymentOptions && (
        <div className='pay'>
          <div>
            <label>
              Pickup Time:
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </label>
            <br /> <br />
            <label>
              Booking Date:
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </label>
            <br />
          </div>
          <h3>Select Rates Option:</h3>
          <label>
            <input
              type="radio"
              value="hourly"
              onChange={handleOptionChange}
            />
            Hourly Rate
          </label>
          <label>
            <input
              type="radio"
              value="daily"
              onChange={handleOptionChange}
            />
            Daily Rate
          </label>
          <br />
          <button onClick={handleBookClick}>Continue</button>
        </div>
      )}
      {paymentOption && showPaymentOptions && (
        <div className="paypal-container">
          <div className="paypal-buttons">
            <h2>Total Bill: {totalBill}$</h2>
            <PayPalScriptProvider options={{ "client-id": "AUqD0H3D-HyokMyCUcOhHvV7sL9qrjFmPVVPTw6WsVaXyTlwhqEgjQF4KAOUz6jQGQP8gFoRKP65gm9e" }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: totalBill,
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    console.log("Payment completed:", details);
                    handleCheckoutComplete();
                  });
                }}
              />
              <button onClick={handleBackClick}>Back</button>
            </PayPalScriptProvider>
          </div>
        </div>
      )}
    </div>
  );
}
