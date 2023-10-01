import React from 'react';
import NotFoundImage from './404.jpg';
import { useNavigate } from 'react-router-dom';
import "../css/404.css";

const NotFound = () => {

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/Cars');
  };

  return (
    <div>
      <div className="not-found-container">
        <h1>Oops, something went wrong!</h1>
        <img src={NotFoundImage} alt="404" className="not-found-image" />
        <p>The page you are looking for does not exist.</p>
        <button onClick={handleLogin}>Back to Cars</button>
      </div>
    </div>
  );
};

export default NotFound;
