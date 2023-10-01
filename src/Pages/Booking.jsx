import React, { useState } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function BookingDialog({ hourlyRate, carId, carData, onBookingClick, isBookingClicked }) {
  const [totalBill, setTotalBill] = useState({hourlyRate});
  const [pickupTime, setPickupTime] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const userId=localStorage.getItem("loggedUser")
  const handleCheckoutComplete = () => {
    const formattedPickupTime = `${bookingDate} ${pickupTime}:00`;
    setTotalBill(hourlyRate);

    // add code to update the availability status here
          try {
             axios.put(`http://localhost:3004/api/cars/${carData.Car_ID}`, {
              Rental_Status: 'Unavailable',
            });
            console.log('Availability status updated successfully.');
          } catch (error) {
            console.error('Error updating availability status:', error);
          }
    setShowPaymentOptions(false);
    axios.post('http://localhost:3004/api/bookings', {
      pickup_time: formattedPickupTime,
      user_id: userId,
      booking_date: bookingDate,
      car_id: carData.Car_ID,
      owner_id: carData.owner_ID,
    })
      .then((response) => {
        console.log("Booking res: ", response.data);
      })
      .catch((error) => {
        console.error('Error creating booking:', error.response.data);
      });
  };

  const handleBackClick = () => {
    setShowPaymentOptions(false);
    setTotalBill(hourlyRate);
  };
  const handleBookClick = async () => {
    const response = await axios.get(`http://localhost:3004/api/userDetails`);
    const res= response.data;
    console.log("prof:", res);
    if (!pickupTime || !bookingDate) {
      console.error('Missing required data for booking');
      return;
    }

    if (!carData || !carData.Car_ID) {
      console.error('Invalid car data:', carData);
      return;
    }

    const formData = new FormData();
    formData.append('pickup_time', pickupTime);
    formData.append('user_id', userId);
    formData.append('booking_date', bookingDate);
    formData.append('car_id', carData.Car_ID);
    formData.append('owner_id', carData.owner_ID);

    try {
      const userResponse = await axios.get(`http://localhost:3004/api/userDetails/${userId}`, {
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

      if (!user || !user.id) {
        console.error('Invalid user data:', user);
        return;
      }

      if (!car[0] || !car[0].Car_ID) {
        console.error('Invalid car data:', car);
        return;
      }

      formData.append('user_id', user.id);
      formData.append('car_id', car[0].Car_ID);
      formData.append('owner_id', car[0].owner_ID);

      // formattedPickupTime = `${bookingDate} ${pickupTime}:00`;
      setTotalBill(hourlyRate);
      const createOrderData = {
        cars: {
          Charges_Per_Hour: totalBill,
        },
      };
      console.log("Creating order")
      axios.post('http://localhost:8888/my-server/create-paypal-order', createOrderData)
        .then((orderResponse) => {
          console.log(orderResponse.data);
          setShowPaymentOptions(true);
         // window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${orderID}`;
        })
        .catch((error) => {
          console.error('Error creating PayPal order:', error);
        });

    } catch (error) {
      console.error('Error fetching user or car details:', error);
    }
  };

  return (
    <div>
      {isBookingClicked && !showPaymentOptions && (
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
            <br /> <br />
          </div>
          <button onClick={handleBookClick}>Billing</button>
        </div>
      )}
      {showPaymentOptions && (
        <div className="paypal-container">
          <div className="paypal-buttons">
            <h2>Total Bill: {totalBill}$</h2>
            <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_CLIENT_ID}}>
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
