import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './ui/Home';
import DataAnalysis from './components/DataAnalysis';
import MergedData from './components/MergedData';
import NewMergedData from './components/NewMergedData';
import FetchUniqueValue from './components/FetchUniqueValue';
import Selection from './components/Selection';
import EDA_Graph from './components/EDA_Graph';
import Prediction from './components/Prediction';
import TrialPage from './components/TrialPage';
import AirbnbForm from './components/pages/AirbnbForm';
import CustomerForm from './components/pages/CustomerForm';
import HotelOwnerForm from './components/pages/HotelOwnerForm';
import Page404 from './components/Page404';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-analysis" element={<DataAnalysis />} />
        <Route path="/merged-data" element={<MergedData />} />
        <Route path="/new-merged-data" element={<NewMergedData />} />
        <Route path="/fetch-unique-value" element={<FetchUniqueValue />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/airbnb-form" element={<AirbnbForm />} />
        <Route path="/customer-form" element={<CustomerForm />} />
        <Route path="/hotel-owner-form" element={<HotelOwnerForm />} />
        <Route path="/eda-graph" element={<EDA_Graph />} />
        <Route path="/final-result" element={<TrialPage />} />
        <Route path="/prediction" element={<Prediction />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
