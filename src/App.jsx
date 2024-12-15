import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './ui/Home';
import DataAnalysis from './components/DataAnalysis';
import MergedData from './components/MergedData';
import FetchUniqueValue from './components/FetchUniqueValue';
import Selection from './components/Selection';
import AirbnbForm from './components/pages/AirbnbForm';
import CustomerForm from './components/pages/CustomerForm';
import HotelOwnerForm from './components/pages/HotelOwnerForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-analysis" element={<DataAnalysis />} />
        <Route path="/merged-data" element={<MergedData />} />
        <Route path="/fetch-unique-value" element={<FetchUniqueValue />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/airbnb-form" element={<AirbnbForm />} />
        <Route path="/customer-form" element={<CustomerForm />} />
        <Route path="/hotel-owner-form" element={<HotelOwnerForm />} />
      </Routes>
    </Router>
  );
}

export default App;
