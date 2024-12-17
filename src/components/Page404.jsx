import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';

const Page404 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000); // Redirect after 10 seconds

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, [navigate]);

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <Layout>
      <style>
        {`
          .page404-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-end; /* Align content to the bottom */
            align-items: center;
            height: 100vh;
            text-align: center;
            background-image: url('/assets/dribble.gif');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 0;
            margin: 0;
          }
          .page404-text-wrapper {
            width: 100%;
            background-color: rgba(0, 0, 0, 0.8); /* Black background with slight transparency */
            color: #fff;
            padding: 20px;
          }
          .page404-text {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .page404-subtext {
            font-size: 1.2rem;
            margin-bottom: 20px;
          }
          .page404-button {
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: bold;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          .page404-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
      <div className="page404-container">
        <div className="page404-text-wrapper">
          <h1 className="page404-text">Page Not Found</h1>
          <p className="page404-subtext">Redirecting to the Home Page in 10 seconds...</p>
          <button onClick={handleRedirect} className="page404-button">
            Go to Home
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Page404;
