import React, { useState, useEffect } from 'react';
import './App.css';
import setting from './setting.png';
import Cars from './Cars.js';
import CarDetails from './CarDetails.js';
import Signup from './signup.js';
import Login from './login.js';
import Settings from './Settings.js';
import Profile from './Profile.js';
import axios from 'axios';
import BookingDialog from './Booking.js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import BookedCars from './BookedCars.js';

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [user, setUser] = useState({ email: '' });
  const [profileData, setProfileData] = useState(null);
  const [paymentOption, setPaymentOption] = useState('');
  const [totalBill, setTotalBill] = useState(0);
  const [isBookingClicked, setIsBookingClicked] = useState(false);
  const [showBookedCars, setShowBookedCars] = useState(false);

  const handleCarClick = (car) => {
    setSelectedCar(car);
    setShowProfilePage(false);
    setIsBookingClicked(false);
  };

  const handleBackClick = () => {
    setSelectedCar(null);
    setShowProfilePage(false);
    setShowBookedCars(false);
  };

  const handleSignup = async (formData) => {
    try {
      console.log('Signup form data:', formData);
      setShowLoginForm(true);
      setIsLoggedIn(true);
      setUser({ email: formData.email });

      await fetchProfileData(formData.email);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogin = async (formData) => {
    try {
      console.log('Login form data:', formData);
      setShowLoginForm(false);
      setIsLoggedIn(true);
      setUser({ email: formData.email });

      await fetchProfileData(formData.email);
      onLogin(formData.email);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedCar(null);
    setShowLoginForm(true);
    setUser(null);
    setProfileData(null);
  };

  const fetchProfileData = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3004/api/userDetails/${email}`);
      setProfileData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw error;
    }
  };

  const handleDeleteAccount = () => {
    try {
      axios
        .delete(`http://localhost:3004/api/userDetails/${user.email}`)
        .then((response) => {
          handleLogout();
        })
        .catch((error) => {
          console.error('Error deleting user account:', error.response.data);
        });
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  };

  const handleProfileClick = () => {
    setSelectedCar(null);
    setShowProfilePage(true);
  };

  const handleClickOutsideDropdown = (event) => {
    const settingsButton = document.getElementById('settings-button');
    if (settingsButton && !settingsButton.contains(event.target)) {
      setShowSettings(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown);
    };
  }, []);

  const onLogin = (email) => {
    console.log('User logged in:', email);
  };

  const handlePayInPerson = (total) => {
    console.log('Pay in Person:', total);
    setPaymentOption('inPerson');
    setTotalBill(total);
  };

  const handleCheckoutComplete = () => {
    setSelectedCar(null);
    setIsBookingClicked(false);
    setPaymentOption('');
    setTotalBill(0);
  };

  const handleBookingClick = () => {
    setIsBookingClicked(true);
  }

  const handleBookedCarsClick = () => {
    setShowBookedCars(true);
    setSelectedCar(null);
    setShowProfilePage(false);
  };

  const initialOptions = {
    clientId: "AUqD0H3D-HyokMyCUcOhHvV7sL9qrjFmPVVPTw6WsVaXyTlwhqEgjQF4KAOUz6jQGQP8gFoRKP65gm9e",
    currency: "USD",
    intent: "capture",
  };

  if (!isLoggedIn) {
    return (
      <div>
        {showLoginForm ? (
          <div className="login-form">
            <h1>Login</h1>
            <Login onLogin={handleLogin} />
            <p>
              Don't have an account? <button onClick={() => setShowLoginForm(false)}>Sign up</button>
            </p>
          </div>
        ) : (
          <div className="signup-form">
            <h1>Sign Up</h1>
            <Signup onSignUp={handleSignup} />
            <p>
              Already have an account? <button onClick={() => setShowLoginForm(true)}>Login</button>
            </p>
          </div>
        )}
      </div>
    );
  } else {
    if (selectedCar && !showProfilePage && !showBookedCars) {
      return (
        <div>
          <div>
            <CarDetails cars={selectedCar} profileData={profileData} onBackClick={handleBackClick} userId={user.id} />
            {!isBookingClicked && (
              <BookingDialog
                onPayInPerson={handlePayInPerson}
                hourlyRate={selectedCar.Charges_Per_Hour}
                carData={selectedCar}
                dailyRate={selectedCar.Charges_Per_Day}
                profileData={profileData}
                onBookingClick={handleBookingClick}
              />
            )}
            {isBookingClicked && paymentOption === 'viaApp' && totalBill > 0 && (
              <div>
                <h2>Total Bill: {totalBill}$</h2>
                <PayPalScriptProvider options={initialOptions}>
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
                </PayPalScriptProvider>
              </div>
            )}
          </div>

          {showProfilePage && (
            <div>
              <Profile
                user={user}
                profileData={profileData}
                isLoggedIn={isLoggedIn}
                showProfilePage={showProfilePage}
                onBackClick={handleBackClick}
              />
            </div>
          )}

          {!selectedCar && !showProfilePage && !showBookedCars && (
            <div>
              <Cars onCarClick={handleCarClick} />
              <div className="settings-button" id="settings-button">
                <button onClick={() => setShowSettings(!showSettings)}>
                  <img src={setting} alt="Settings" />
                </button>
                {showSettings && (
                  <Settings
                    onLogout={handleLogout}
                    onProfileClick={handleProfileClick}
                    onDeleteAccount={() => handleDeleteAccount(user.email)}
                    onBookedClick={handleBookedCarsClick}
                    user={user}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      );
    } else if (showProfilePage && !showBookedCars) {
      return (
        <div>
          <Profile
            user={user}
            profileData={profileData}
            isLoggedIn={isLoggedIn}
            showProfilePage={showProfilePage}
            onBackClick={handleBackClick}
          />
        </div>
      );
    } else if (showBookedCars) {
      return (
        <div>
          <BookedCars user={user} onBackClick={handleBackClick} profileData={profileData}/>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <Cars onCarClick={handleCarClick} />
          </div>
          <div className="settings-button" id="settings-button">
            <button onClick={() => setShowSettings(!showSettings)}>
              <img src={setting} alt="Settings" />
            </button>
            {showSettings && (
              <Settings
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
                onDeleteAccount={() => handleDeleteAccount(user.email)}
                onBookedClick={handleBookedCarsClick}
                user={user}
              />
            )}
          </div>
        </div>
      );
    }
  }
}
