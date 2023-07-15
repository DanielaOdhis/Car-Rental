import React, { useState } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function BookingDialog({ onPayInPerson, onPayViaApp, hourlyRate, dailyRate, onBookingClick, isBookingClicked, carId, userId }) {
  const [paymentOption, setPaymentOption] = useState('');
  const [totalBill, setTotalBill] = useState(0);
  const [pickupTime, setPickupTime] = useState('');
  const [bookingDate, setBookingDate] = useState('');

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setPaymentOption(selectedOption);

    if (selectedOption === 'hourly') {
      setTotalBill(hourlyRate);
    } else if (selectedOption === 'daily') {
      setTotalBill(dailyRate);
    }
  };

  const handlePayInPerson = () => {
    onPayInPerson(totalBill);
  };

  const handleCheckoutComplete = () => {
    setPaymentOption('');
    setTotalBill(0);
  };

  const handleBackClick = () => {
    setPaymentOption('');
  };

  const handleBookClick = () => {
    if (!pickupTime || !bookingDate || !carId || !userId) {
      console.error('Missing required data for booking');
      return;
    }
  
    const formData = {
      pickup_time: `${bookingDate} ${pickupTime}:00`, // Combine date and time values
      booking_date: bookingDate,
      car_id: carId,
      user_id: userId,
    };
  
    axios.post('http://localhost:3004/api/bookings', formData)
      .then((response) => {
        console.log(response.data);
        onBookingClick();
      })
      .catch((error) => {
        console.error('Error creating booking:', error.response.data);
      });
  };
  

  return (
    <div>
      {!isBookingClicked && (
        <div className='pay'>
          <label>
            Pickup Time:
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </label>
          <br />
          <label>
            Booking Date:
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleBookClick}>Book</button>
        </div>
      )}

      {isBookingClicked && !paymentOption && (
        <div className='pay'>
          <h3>Select Payment Option:</h3>
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
          <button onClick={handleBookClick}>Book</button>
        </div>
      )}

      {paymentOption && paymentOption !== 'viaApp' && (
        <div className={`payment-method-overlay ${paymentOption ? 'show' : ''}`}>
          <div className="payment-method-modal">
            <h3>Select Payment Method:</h3>
            <label>
              <input
                type="radio"
                value="inPerson"
                checked={paymentOption === 'inPerson'}
                onChange={handleOptionChange}
              />
              Pay in Person
            </label>
            <label>
              <input
                type="radio"
                value="viaApp"
                checked={paymentOption === 'viaApp'}
                onChange={handleOptionChange}
              />
              Pay via App
            </label>
            <br />
            <button onClick={handlePayInPerson} disabled={!paymentOption || paymentOption === 'viaApp'}>
              Book
            </button>
          </div>
        </div>
      )}

      {paymentOption === 'viaApp' && (
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
