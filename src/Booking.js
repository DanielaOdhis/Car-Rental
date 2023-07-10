import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function BookingDialog({ onPayInPerson, onPayViaApp, hourlyRate, dailyRate, onBookingClick, isBookingClicked }) {
  const [paymentOption, setPaymentOption] = useState('');
  const [totalBill, setTotalBill] = useState(0);

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

  return (
    <div>
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
          <button onClick={onBookingClick}>Book</button>
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
