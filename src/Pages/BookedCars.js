import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

export default function BookedCars({ onBackClick, profileData, carData }) {
  const [bookedCars, setBookedCars] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [totalBill, setTotalBill] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate=useNavigate();

  useEffect(() => {
    if (profileData && profileData.id) {
      fetchBookedCars(profileData.id);
    }

   /* const storedBookedCars = JSON.parse(localStorage.getItem('handleBookedCarsClick'));
    if (storedBookedCars) {
      setBookedCars(storedBookedCars);
    }*/
  }, [profileData]);

  /*useEffect(() => {
    if (bookedCars.length > 0) {
      localStorage.setItem('handleBookedCarsClick', JSON.stringify(bookedCars));
    } else {
      localStorage.removeItem('handleBookedCarsClick');
    }
  }, [bookedCars]);*/

  const fetchBookedCars = async (userId) => {
    try {
      const userResponse = await axios.get(`http://localhost:3004/api/userDetails/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const user = userResponse.data;

      if (user && user.id) {
        const response = await axios.get(`http://localhost:3004/api/bookedCars/${user.id}`);
        const bookedCars = response.data;

        const carsWithDetails = await Promise.all(
          bookedCars.map(async (bookedCar) => {
            const carDetailsResponse = await axios.get(`http://localhost:3004/api/cars/${bookedCar.car_id}`);
            const ownerDetailsResponse = await axios.get(`http://localhost:3004/api/ownerDetails/${carDetailsResponse.data[0].owner_ID}`);

            const totalBillValue = (bookedCar.total_time - 1) * carDetailsResponse.data[0].Charges_Per_Hour;
          setTotalBill(totalBillValue.toFixed(2));
            const carDetails = carDetailsResponse.data[0];

            return {
              ...bookedCar,
              car_details: carDetails,
              owner_details: ownerDetailsResponse.data,
            };
          })
        );
        setLoading(false);
        setBookedCars(carsWithDetails);
      } else {
        setLoading(false);
        console.error('Invalid user data:', user);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching booked cars:', error);
    }
  };

  const deleteBookedCar = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3004/api/bookedCars/${id}`);
      if (response.status === 200) {
        try {
          await axios.put(`http://localhost:3004/api/cars/${bookedCars.find(car => car.id === id).car_id}`, {
            Rental_Status: 'Available',
          });
          console.log('Availability status updated successfully.');
        } catch (error) {
          console.error('Error updating availability status:', error);
        }
        console.log('Booking canceled successfully.');
        fetchBookedCars(profileData.id);
      } else {
        console.error('Error canceling booking:', response.statusText);
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

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

  const handleBooking = (booking) => {
    setSelectedBooking(booking);
  };

  useEffect(() => {
    if (selectedBooking) {

      const createOrderData = {
        cars: {
          Charges_Per_Hour: {
            hourlyRate: totalBill,
          },
        },
      };
      console.log("Creating order");
      axios
        .post('http://localhost:8888/my-server/create-paypal-order', createOrderData)
        .then((orderResponse) => {
          console.log(orderResponse.data);
          setShowPaymentOptions(true);
        })
        .catch((error) => {
          console.error('Error creating PayPal order:', error);
        });
    }
  }, [totalBill, selectedBooking]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmation(true);
  };

  const confirmCancel = () => {
    setShowConfirmation(false);
    if (selectedBooking) {
      deleteBookedCar(selectedBooking.id);
      setSelectedBooking(null);
    }
  };

  const cancelCancel = () => {
    setShowConfirmation(false);
    setSelectedBooking(null);
  };

  const formatTimeInHours = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const handleCheckoutComplete = async () => {
    try {
      if (selectedBooking) {
        await deleteBookedCar(selectedBooking.id);
        setSelectedBooking(null);
      }

      setShowPaymentOptions(false);
      setTotalBill(0);

    } catch (error) {
      console.error('Error handling checkout completion:', error);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentOptions(false);
    setTotalBill(0);
    setSelectedBooking(null);
  };
const handleBackClick= () => {
  setShowPaymentOptions(false);
  setSelectedBooking(null);
};

const handleBack=()=>{
  onBackClick();
  navigate('/Cars');
  //localStorage.removeItem('handleBookedCarsClick');
}
  return (
    <div>
      <h1>Booked Cars</h1>
      {loading ? (
        <div className="loading-container">
        <p className="loading-spinner">Loading...</p>
        </div>
      ) : bookedCars.length > 0 ? (
        <div className='booked-car-details'>
          {bookedCars.map((booking) => (
            <div className='booked' key={booking.id}>
              <h2>{booking.car_details.Car_Type}</h2>
              <div onClick={() => handleCancelClick(booking)}>
                <img src={bufferToBase64(booking.car_details.image)} alt={booking.car_details.Car_Type} />
              </div>
              <p><b>Owner's User Name</b>: {booking.owner_details.username}</p>
              <p><b>Owner's Telephone</b>: {booking.owner_details.phoneNumber}</p>
              <p><b>Booking Date</b>: {booking.booking_date}</p>
              <p><b>Pickup Time</b>: {booking.pickup_time}</p>
              <p><b>Time Elapsed</b>: {formatTimeInHours(booking.total_time * 3600)}</p>
              <div onClick={() => handleBooking(booking)}>
                <p><b>Total Bill</b>: {totalBill}$</p>
              </div>
              {showPaymentOptions && selectedBooking && selectedBooking.id === booking.id && (
                <div className="paypal-container">
                  <div className="paypal-buttons">
                    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_CLIENT_ID }}>
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
                        onCancel={handlePaymentCancel}
                      />
                    </PayPalScriptProvider>
                    <button onClick={handleBackClick}>Back</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div>
            <button onClick={handleBack}>Back</button>
          </div>
        </div>
      ) : (
        <div>
          <p className="no-cars-message">No booked cars found.</p>
          <button onClick={handleBack}>Back</button>
        </div>
      )}
      {showConfirmation && (
        <div className="confirmation-modal">
          <p>You're about to cancel this order. Are you sure?</p>
          <button onClick={confirmCancel}>Confirm</button>
          <button onClick={cancelCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}