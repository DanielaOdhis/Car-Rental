import React, { useState, useEffect } from 'react';
import './App.css';
import setting from './setting.png';
import Cars from './Pages/Cars.js';
import CarDetails from './Pages/CarDetails.js';
import Signup from './Pages/signup.js';
import Login from './Pages/login.js';
import Settings from './Pages/Settings.js';
import Profile from './Pages/Profile.js';
import axios from 'axios';
import BookingDialog from './Pages/Booking.js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import BookedCars from './Pages/BookedCars.js';
import Forgot from './Pages/forgotPassword.js';
import NotFound from "./Pages/NotFound.js";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
  const [showForgot, setShowForgot] = useState(false);

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
     // localStorage.setItem('loggedInUser', JSON.stringify(formData));
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
   // localStorage.removeItem('loggedInUser');
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
   /* const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
      fetchProfileData(storedUser.email);
    }

  /* const storedSelectedCar = JSON.parse(localStorage.getItem('selectedCar'));
    if (storedSelectedCar) {
      setSelectedCar(storedSelectedCar);
    }

    const storedProfileData = JSON.parse(localStorage.getItem('profileData'));
    if (storedProfileData) {
      setProfileData(storedProfileData);
      setShowProfilePage(true);
    }

     const storedBookedCars = JSON.parse(localStorage.getItem('handleBookedCarsClick'));
    if (storedBookedCars) {
      setShowBookedCars(storedBookedCars);
    }*/

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
    clientId: process.env.REACT_APP_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const handleForgotLog = () => {
    setShowForgot(false);
    setShowLoginForm(true);
  };

  return (
    <BrowserRouter>
      <div>
        {isLoggedIn ? (
          <>
            {selectedCar && !showProfilePage && !showBookedCars ? (
              <div>
                <CarDetails cars={selectedCar} profileData={profileData} onBackClick={handleBackClick} userId={user.id} />
                {!isBookingClicked && (
                  <BookingDialog
                    onPayInPerson={handlePayInPerson}
                    hourlyRate={selectedCar.Charges_Per_Hour}
                    carData={selectedCar}
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
            ) : null}

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

            {showBookedCars && (
              <div>
                <BookedCars
                  user={user}
                  onBackClick={handleBackClick}
                  profileData={profileData}
                  totalBill={totalBill}
                  initialOptions={initialOptions}
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
          </>
        ) : (
          <>
            <Routes>
              <Route path="/signup" element={<Signup onSignUp={handleSignup} />} />
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/forgot-Password" element={<Forgot onBack={handleForgotLog} />} />
              <Route path="/Cars" element={<Cars onCarClick={handleCarClick} />} />
              <Route path="/Cars-Details" element={<CarDetails cars={selectedCar} profileData={profileData} onBackClick={handleBackClick} userId={user.id} /> }/>
              <Route path="/Booked-Cars" element={<BookedCars user={user} onBackClick={handleBackClick} profileData={profileData} totalBill={totalBill} initialOptions={initialOptions}/>} />
              <Route path="/profile" element={<Profile user={user} profileData={profileData} isLoggedIn={isLoggedIn} showProfilePage={showProfilePage} onBackClick={handleBackClick}  />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}
