import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import logo from '../Design-of-New-Logo-of-IITJ-2.png';

const Header = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* Left Section: Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '0.2rem',
            borderRadius: '5px',
          }}
        >
          <img
            src={logo}
            alt="IITJ Logo"
            width="40"
          />
        </Box>
      </Box>

      {/* Center Section: Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
        }}
      >
        IITJ - Airbnb Data Cleaning, Processing and Advanced Analysis
      </Typography>

      {/* Right Section: Current Time */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        {time}
      </Typography>
    </Box>
  );
};

export default Header;
