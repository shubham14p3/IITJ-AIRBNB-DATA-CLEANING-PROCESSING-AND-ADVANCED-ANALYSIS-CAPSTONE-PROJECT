import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Pagination,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function App() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('listings');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Add this state for rows per page

  useEffect(() => {
    // Fetching data using async/await
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to the first page when items per page change
  };

  const getCurrentData = (type) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (!data) return [];

    switch (type) {
      case 'listings':
        return data.listings.slice(startIndex, endIndex);
      case 'calendar':
        return data.calendar.slice(startIndex, endIndex);
      case 'reviews':
        return data.reviews.slice(startIndex, endIndex);
      default:
        return [];
    }
  };

  const renderTableData = (data) => {
    return data.map((item, index) => (
      <TableRow key={index}>
        {Object.values(item).slice(0, 5).map((val, i) => (
          <TableCell key={i}>{val}</TableCell>
        ))}
      </TableRow>
    ));
  };

  const totalPages = data ? Math.ceil(data[activeTab].length / itemsPerPage) : 1;

  return (
    <Container maxWidth="lg" className="app-container">
      <Typography variant="h4" gutterBottom align="center">
      IITJ - AIRBNB DATA CLEANING, PROCESSING AND ADVANCED ANALYSIS
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Listings" value="listings" />
          <Tab label="Calendar" value="calendar" />
          <Tab label="Reviews" value="reviews" />
        </Tabs>
      </Box>

      {/* Rows per Page Select */}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <FormControl variant="outlined" size="small">
          <InputLabel id="rows-per-page-select-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-select-label"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            label="Rows per page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Display Table */}
      <Box mt={2}>
        {data ? (
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(getCurrentData(activeTab)[0] || {}).slice(0, 5).map((key, i) => (
                  <TableCell key={i}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{renderTableData(getCurrentData(activeTab))}</TableBody>
          </Table>
        ) : (
          <Typography align="center">Loading data...</Typography>
        )}

        {/* Pagination */}
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
