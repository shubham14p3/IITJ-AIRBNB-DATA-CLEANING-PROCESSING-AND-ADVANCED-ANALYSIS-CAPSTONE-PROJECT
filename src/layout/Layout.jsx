import React from 'react';
import { Box } from '@mui/material';
import Footer from '../ui/Footer';
import Header from '../ui/Header';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Full viewport height
        overflow: 'hidden', // Prevent parent scrolling
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: '10%', // Fixed height for the header
          width: '100%',
          position: 'relative',
        }}
      >
        <Header />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          overflowY: 'auto', // Scroll only this area
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
